import React from "react";
import semver from "semver";
import { useApolloClient } from "@apollo/client";
import config from "../config";
import { UsbConnectIcon, UsbDisconnectIcon } from "../icons";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import {
  useConnectMutation,
  useConnectionSettingsQuery,
  useDisconnectMutation,
  ApiVersionQueryVariables,
  ApiVersionQuery,
  ApiVersionDocument,
  useOnConnectionClosedSubscription,
} from "../gql/__generated__";
import BigButton from "../components/BigButton";

/**
 * Handle all aspects of tracking the app connection
 * to the device, as well as providing an interface
 * for the user to "connect" or "disconect"
 */
const ConnectionManager: React.FC = () => {
  const client = useApolloClient();
  const log = useLogger();
  const { data: configuratorQuery } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const {
    connected,
    connecting,
    connection,
    setConnection,
    setConnecting,
  } = useConnectionState();

  const [disconnect] = useDisconnectMutation({
    variables: {
      connection: connection ?? "",
    },
    onCompleted: ({ close: connectionId }) => {
      log(
        `Serial port <span class="message-positive">successfully</span> closed for connectionId=${connectionId}`
      );
      setConnection(null);
    },
    onError: () => {
      setConnection(null);
    },
  });

  const [connect] = useConnectMutation({
    variables: {
      port: port ?? "",
      baudRate: baudRate ?? 0,
    },
    onCompleted: async ({ connect: connectionId }) => {
      if (!connecting) {
        return;
      }

      log(
        `Serial port <span class="message-positive">successfully</span> opened, connectionId=${connectionId}`
      );

      const { data } = await client.query<
        ApiVersionQuery,
        ApiVersionQueryVariables
      >({
        query: ApiVersionDocument,
        variables: {
          connection: connectionId,
        },
      });

      const apiVersion = data?.device.apiVersion;
      if (apiVersion) {
        log(`MultiWii API version: <strong>${apiVersion}</strong>`);
        if (semver.lt(apiVersion, config.apiVersionAccepted)) {
          log(
            `MSP version not supported: <span class="message-negative">${apiVersion}</span>`
          );
          disconnect({
            variables: {
              connection: connectionId,
            },
          });
        } else {
          setConnection(connectionId);
        }
      } else {
        log(`Error reading api version for ${connectionId}`);
        disconnect({
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
  });

  // Create a subscription to the current connection
  // and handle updating the app state when connection
  // is closed
  useOnConnectionClosedSubscription({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection || !connected,
    onSubscriptionData: ({ subscriptionData }) => {
      const connectionId = subscriptionData.data?.onClosed;
      if (connectionId === connection) {
        setConnection(null);
        log(`Serial port closed unexpectedly for connectionId=${connectionId}`);
      }
    },
  });

  const handleClicked = (): void => {
    if (!connected && !connecting) {
      log(`Opening connection on ${port}`);
      setConnecting(true);
      connect();
    } else {
      if (connecting && !connected) {
        log(`Connection attempt to ${port} aborted`);
      }
      setConnecting(false);
      if (connection) {
        disconnect();
      }
    }
  };

  let statusText = "Connecting";

  if (!connecting) {
    statusText = connected ? "Disconnect" : "Connect";
  }

  return (
    <BigButton
      active={connected}
      icon={
        !connected && !connecting ? <UsbConnectIcon /> : <UsbDisconnectIcon />
      }
      text={statusText}
      onClick={handleClicked}
    />
  );
};

export default ConnectionManager;
