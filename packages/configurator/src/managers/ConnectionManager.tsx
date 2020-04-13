import React, { useRef, useEffect, useReducer } from "react";
import semver from "semver";
import config from "../config";
import { UsbConnectIcon, UsbDisconnectIcon } from "../icons";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import {
  useConnectMutation,
  useConnectionSettingsQuery,
  useDisconnectMutation,
  useOnConnectionClosedSubscription,
} from "../gql/__generated__";
import BigButton from "../components/BigButton";

/**
 * Handle all aspects of tracking the app connection
 * to the device, as well as providing an interface
 * for the user to "connect" or "disconect"
 */
const ConnectionManager: React.FC = () => {
  const log = useLogger();

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
      if (!isCurrentAttempt()) {
        return;
      }
      log(
        `Serial port <span class="message-positive">successfully</span> closed for connectionId=${connectionId}`
      );
      setConnection(null);
    },
    onError: () => {
      if (!isCurrentAttempt()) {
        return;
      }
      setConnection(null);
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
    skip: !connection || !connected,
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
    if (!connected && !connecting) {
      log(`Opening connection on ${port}`);
      setConnecting(true);
      connect();
    } else {
      setConnecting(false);
      if (connection) {
        disconnect();
      }
      if (connecting && !connected) {
        log(`Connection attempt to ${port} aborted`);
        handleAborted();
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
