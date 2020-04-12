import React from "react";
import semver from "semver";
import { useApolloClient } from "@apollo/client";
import config from "../config";
import { UsbConnectIcon, UsbDisconnectIcon } from "../icons";
import useConnectionState from "../hooks/useConnectionState";
import {
  useConnectMutation,
  useConnectionSettingsQuery,
  useDisconnectMutation,
  useSetConnectionMutation,
  useSetConnectingMutation,
  useLogMutation,
  ApiVersionQueryVariables,
  ApiVersionQuery,
  ApiVersionDocument,
  useOnConnectionClosedSubscription,
} from "../gql/__generated__";
import BigButton from "../components/BigButton";

const ConnectControlsManager: React.FC = () => {
  const client = useApolloClient();
  const { data: configuratorQuery } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const [log] = useLogMutation();
  const { connected, connecting, connection } = useConnectionState();

  const [setConnection] = useSetConnectionMutation();
  const [setConnecting] = useSetConnectingMutation();

  const [disconnect] = useDisconnectMutation({
    variables: {
      connection: connection ?? "",
    },
    onCompleted: ({ close: connectionId }) => {
      log({
        variables: {
          message: `Serial port <span class="message-positive">successfully</span> closed for connectionId=${connectionId}`,
        },
      });
      setConnection({
        variables: {
          connection: null,
        },
      });
    },
    onError: () => {
      setConnection({
        variables: {
          connection: null,
        },
      });
    },
  });

  const [connect] = useConnectMutation({
    variables: {
      port: port ?? "",
      baudRate: baudRate ?? 0,
    },
    onCompleted: async ({ connect: connectionId }) => {
      log({
        variables: {
          message: `Serial port <span class="message-positive">successfully</span> opened, connectionId=${connectionId}`,
        },
      });

      try {
        const { data } = await client.query<
          ApiVersionQuery,
          ApiVersionQueryVariables
        >({
          query: ApiVersionDocument,
          variables: {
            connection: connectionId,
          },
        });
        const { apiVersion } = data.device;
        log({
          variables: {
            message: `MultiWii API version: <strong>${apiVersion}</strong>`,
          },
        });
        if (semver.lt(apiVersion, config.apiVersionAccepted)) {
          log({
            variables: {
              message: `MSP version not supported: <span class="message-negative">${apiVersion}</span>`,
            },
          });
          disconnect({
            variables: {
              connection: connectionId,
            },
          });
        } else {
          setConnection({
            variables: {
              connection: connectionId,
            },
          });
        }
      } catch (e) {
        log({
          variables: {
            message: `Error reading api version for ${connectionId}: <strong>${e.message}</strong>`,
          },
        });
        disconnect({
          variables: {
            connection: connectionId,
          },
        });
      }

      setConnecting({
        variables: {
          value: false,
        },
      });
    },
    onError: (e) => {
      log({
        variables: {
          message: `Could not open connection (<span class="message-negative">${e.message}</span>), communication <span class="message-negative">failed</span>`,
        },
      });
      setConnecting({
        variables: {
          value: false,
        },
      });
    },
  });

  useOnConnectionClosedSubscription({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    onSubscriptionData: ({ subscriptionData }) => {
      const connectionId = subscriptionData.data?.onClosed;
      if (connectionId) {
        disconnect({
          variables: {
            connection: connectionId,
          },
        });
      }
    },
  });

  const handleClicked = (): void => {
    if (!connected && !connecting) {
      log({
        variables: {
          message: `Opening connection on ${port}`,
        },
      });
      setConnecting({
        variables: {
          value: true,
        },
      });
      connect();
    } else {
      setConnecting({
        variables: {
          value: false,
        },
      });
      disconnect();
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

export default ConnectControlsManager;
