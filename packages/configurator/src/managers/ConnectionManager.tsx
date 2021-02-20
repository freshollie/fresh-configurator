import React, { useEffect, useCallback } from "react";
import semver from "semver";
import config from "../config";
import Icon from "../components/Icon";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";

import BigButton from "../components/BigButton";
import { gql, useMutation, useQuery, useSubscription } from "../gql/apollo";

/**
 * Handle all aspects of tracking the app connection
 * to the device, as well as providing an interface
 * for the user to "connect" or "disconnect"
 */
const ConnectionManager: React.FC = () => {
  const log = useLogger();

  const { data: configuratorQuery } = useQuery(
    gql`
      query ConnectionSettings {
        configurator @client {
          port
          baudRate
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionManager").ConnectionSettingsQuery,
      import("./__generated__/ConnectionManager").ConnectionSettingsQueryVariables
    >
  );
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const {
    connecting,
    connection,
    setConnection,
    setConnecting,
  } = useConnectionState();

  const [disableArming] = useMutation(
    gql`
      mutation DisableArming($connection: ID!) {
        deviceSetArming(
          connectionId: $connection
          armingDisabled: true
          runawayTakeoffPreventionDisabled: false
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionManager").DisableArmingMutation,
      import("./__generated__/ConnectionManager").DisableArmingMutationVariables
    >,
    {
      onCompleted: () => {
        log("<b>Arming disabled</b>");
      },
      onError: (e) => {
        log(
          `<span class="message-negative">Error disabling arming: ${e.message}</span>`
        );
      },
    }
  );

  const [disconnectMutation] = useMutation(
    gql`
      mutation Disconnect($connection: ID!) {
        close(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionManager").DisconnectMutation,
      import("./__generated__/ConnectionManager").DisconnectMutationVariables
    >
  );

  const disconnect = (
    notify = true,
    connectionId = connection
  ): Promise<void> =>
    disconnectMutation({
      variables: {
        connection: connectionId ?? "",
      },
    })
      .then(() => {
        if (notify) {
          log(
            `Serial port <span class="message-positive">successfully</span> closed for connectionId=${connectionId}`
          );
        }
      })
      .catch((e) => {
        if (notify) {
          log(`Error closing connection: ${e.message}`);
        }
      });

  const [connect] = useMutation(
    gql`
      mutation Connect($port: String!, $baudRate: Int!) {
        connect(port: $port, baudRate: $baudRate) {
          id
          apiVersion
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionManager").ConnectMutation,
      import("./__generated__/ConnectionManager").ConnectMutationVariables
    >,
    {
      variables: {
        port: port ?? "",
        baudRate: baudRate ?? 0,
      },
      onCompleted: ({ connect: { id: connectionId, apiVersion } }) => {
        if (!connecting) {
          disconnect(false, connectionId);
          return;
        }

        log(
          `Serial port <span class="message-positive">successfully</span> opened, connectionId=${connectionId}`
        );
        log(`MultiWii API version: <strong>${apiVersion}</strong>`);
        if (semver.lt(apiVersion, config.apiVersionAccepted)) {
          log(
            `MSP version not supported: <span class="message-negative">${apiVersion}</span>`
          );
          disconnect(true, connectionId);
        } else {
          setConnection(connectionId);
          disableArming({
            variables: {
              connection: connectionId,
            },
          });
        }
        setConnecting(false);
      },
      onError: (e) => {
        if (!connecting) {
          return;
        }
        log(
          `Could not open connection (<span class="message-negative">${e.message}</span>), communication <span class="message-negative">failed</span>`
        );
        setConnecting(false);
      },
    }
  );

  const connectionClosed = useCallback(() => {
    setConnection(null);
    log(`Serial port closed unexpectedly for connectionId=${connection}`);
  }, [connection, log, setConnection]);

  // Create a subscription to the current connection
  // and handle updating the app state when connection
  // is closed
  const { error: subscriptionError } = useSubscription(
    gql`
      subscription OnConnectionChanged($connection: ID!) {
        onConnectionChanged(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionManager").OnConnectionChangedSubscription,
      import("./__generated__/ConnectionManager").OnConnectionChangedSubscriptionVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      skip: !connection,
      onSubscriptionData: ({ subscriptionData: { data: onChangedData } }) => {
        const newConnectionId = onChangedData?.onConnectionChanged;
        if (newConnectionId) {
          setConnection(newConnectionId);
          log(
            `Serial port reconnected for connectionId=${connection} newConnectionId=${newConnectionId} `
          );
        } else if (newConnectionId === null) {
          connectionClosed();
        }
      },
    }
  );

  useEffect(() => {
    if (subscriptionError) {
      connectionClosed();
    }
  }, [connectionClosed, log, subscriptionError]);

  const handleClicked = (): void => {
    if (!connection && !connecting) {
      log(`Opening connection on ${port}`);
      setConnecting(true);
      connect();
    } else {
      if (connection) {
        disconnect();
        setConnection(null);
      } else if (connecting) {
        log(`Connection attempt to ${port} aborted`);
      }
      setConnecting(false);
    }
  };

  let statusText = "Connecting";

  if (!connecting) {
    statusText = connection ? "Disconnect" : "Connect";
  }

  const disconnected = !connection && !connecting;

  return (
    <BigButton
      active={!!connection}
      data-testid={disconnected ? "connect-button" : "disconnect-button"}
      icon={<Icon name={disconnected ? "usb-connect" : "usb-disconnect"} />}
      text={statusText}
      onClick={handleClicked}
    />
  );
};

export default ConnectionManager;
