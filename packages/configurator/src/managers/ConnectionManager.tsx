import React, { useRef, useEffect, useReducer } from "react";
import semver from "semver";
import config from "../config";
import Icon from "../components/Icon";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import { useConnectionSettingsQuery } from "../gql/queries/Configurator.graphql";
import {
  useConnectMutation,
  useDisconnectMutation,
  useOnConnectionClosedSubscription,
} from "../gql/mutations/Connection.graphql";
import { useSetArmingMutation } from "../gql/mutations/Device.graphql";

import BigButton from "../components/BigButton";

/**
 * Handle all aspects of tracking the app connection
 * to the device, as well as providing an interface
 * for the user to "connect" or "disconect"
 */
const ConnectionManager: React.FC = () => {
  const log = useLogger();

  // Handle keeping track of what connection attempt we are
  // on so we can ignore responses from mutations against
  // different attempts
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const attempt = useRef(0);
  const connectionAttempt = attempt.current;
  const isCurrentAttempt = (): boolean => attempt.current === connectionAttempt;
  const handleAborted = (): void => {
    attempt.current += 1;
    forceUpdate();
  };

  const { data: configuratorQuery } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const {
    connecting,
    connection,
    setConnection,
    setConnecting,
  } = useConnectionState();

  const [disableArming] = useSetArmingMutation({
    onCompleted: () => {
      log("<b>Arming disabled</b>");
    },
    onError: (e) => {
      log(
        `<span class="message-negative">Error disabling arming: ${e.message}</span>`
      );
    },
  });

  const [disconnect] = useDisconnectMutation({
    variables: {
      connection: connection ?? "",
    },
    onCompleted: ({ close: connectionId }) => {
      if (!isCurrentAttempt()) {
        return;
      }
      log(
        `Serial port <span class="message-positive">successfully</span> closed for connectionId=${connectionId}`
      );
    },
  });

  const [connect] = useConnectMutation({
    variables: {
      port: port ?? "",
      baudRate: baudRate ?? 0,
    },
    onCompleted: ({ connect: { id: connectionId, apiVersion } }) => {
      if (!connecting || !isCurrentAttempt()) {
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
        disconnect({
          variables: {
            connection: connectionId,
          },
        });
      } else {
        setConnection(connectionId);
        disableArming({
          variables: {
            connection: connectionId,
            armingDisabled: true,
            runawayTakeoffPreventionDisabled: false,
          },
        });
      }
      setConnecting(false);
    },
    onError: (e) => {
      if (!connecting || !isCurrentAttempt()) {
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
  const { error: subscriptionError } = useOnConnectionClosedSubscription({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    onSubscriptionData: ({ subscriptionData }) => {
      const connectionId = subscriptionData.data?.onClosed;
      if (connectionId === connection) {
        setConnection(null);
        log(`Serial port closed unexpectedly for connectionId=${connectionId}`);
      }
    },
  });

  useEffect(() => {
    if (subscriptionError && connection) {
      setConnection(null);
      log(`Serial port closed unexpectedly for connectionId=${connection}`);
    }
  }, [connection, log, setConnection, subscriptionError]);

  const handleClicked = (): void => {
    if (!connection && !connecting) {
      log(`Opening connection on ${port}`);
      setConnecting(true);
      connect();
    } else {
      setConnecting(false);
      if (connection) {
        disconnect();
        setConnection(null);
      }
      if (connecting && !connection) {
        log(`Connection attempt to ${port} aborted`);
        handleAborted();
      }
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
