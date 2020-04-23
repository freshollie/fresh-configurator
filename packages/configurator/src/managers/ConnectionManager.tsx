import React, { useRef, useEffect, useReducer, useCallback } from "react";
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
 * Useful for conncurrency tracking, where a given response
 * might come back after a new request has been submitted.
 *
 * Use this hook when you want to know if a new request has been
 * sent in the time you were waiting for the response.
 *
 * This works by using a ref to keep track of the latest attempt,
 * vs the in memory attempt of the given render.
 */
const useAttemptTracking = (): {
  /**
   * Called when you want to invalidate all previous attempts
   */
  newAttempt: () => void;
  /**
   * Called when you want to check if the current attempt
   * is the last valid attempt
   */
  isCurrentAttempt: () => boolean;
} => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const attempt = useRef(0);
  const currentAttempt = attempt.current;

  return {
    newAttempt: useCallback(() => {
      attempt.current += 1;
      forceUpdate();
    }, [forceUpdate, attempt]),

    isCurrentAttempt: useCallback(() => attempt.current === currentAttempt, [
      currentAttempt,
    ]),
  };
};

/**
 * Handle all aspects of tracking the app connection
 * to the device, as well as providing an interface
 * for the user to "connect" or "disconnect"
 */
const ConnectionManager: React.FC = () => {
  const log = useLogger();
  const { isCurrentAttempt, newAttempt } = useAttemptTracking();

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
    onError: (e) => {
      if (!isCurrentAttempt()) {
        return;
      }
      log(`Error closing connection: ${e.message}`);
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
  const {
    error: subscriptionError,
    data: onClosedData,
  } = useOnConnectionClosedSubscription({
    variables: {
      connection: connection ?? "",
    },
    shouldResubscribe: false,
    skip: !connection,
  });

  const connectionClosed =
    onClosedData && connection && onClosedData.onClosed === connection;

  useEffect(() => {
    if ((subscriptionError || connectionClosed) && connection) {
      setConnection(null);
      log(`Serial port closed unexpectedly for connectionId=${connection}`);
    }
  }, [connection, connectionClosed, log, setConnection, subscriptionError]);

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
        newAttempt();
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
