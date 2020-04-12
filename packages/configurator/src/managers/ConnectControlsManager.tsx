import React from "react";
import { UsbConnectIcon, UsbDisconnectIcon } from "../icons";
import useConnectionState from "../hooks/useConnectionState";
import {
  useConnectMutation,
  useConnectionSettingsQuery,
  useDisconnectMutation,
  useSetConnectionMutation,
  useSetConnectingMutation,
} from "../gql/__generated__";
import BigButton from "../components/BigButton";
import useConnectionId from "../hooks/useConnectionId";

// log(client, `Opening connection on ${port}`);
//         const version = apiVersion(port);
//         log(
//             client,
//             `Serial port <span class="message-positive">successfully</span> closed on ${port}`
//           );

//         log(
//           client,
//           `Serial port <span class="message-positive">successfully</span> opened on ${port}`
//         );

//         log(client, `MultiWii API version: <strong>${version}</strong>`);

//         if (semver.gte(version, config.apiVersionAccepted)) {
//           setConnectionState(client, port, false, true);
//           return true;
//         }
//         log(
//           client,
//           `MSP version not supported: <span class="message-negative">${version}</span>`
//         );
//       } catch (e) {
//         log(
//           client,
//           `Could not open connection (<span class="message-negative">${e.message}</span>), communication <span class="message-negative">failed</span>`
//         );
//       }

const ConnectControlsManager: React.FC = () => {
  const { data: configuratorQuery } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const connection = useConnectionId();

  const { connected, connecting } = useConnectionState();
  const [setConnection] = useSetConnectionMutation();
  const [setConnecting] = useSetConnectingMutation();
  const [connect] = useConnectMutation({
    variables: {
      port: port ?? "",
      baudRate: baudRate ?? 0,
    },
    onCompleted: ({ connect: connectionId }) => {
      setConnecting({
        variables: {
          value: false,
        },
      });
      setConnection({
        variables: {
          connection: connectionId,
        },
      });
    },
    onError: () => {
      setConnecting({
        variables: {
          value: false,
        },
      });
    },
  });
  const [disconnect] = useDisconnectMutation({
    variables: {
      connection: connection ?? "",
    },
    onCompleted: () => {
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

  const handleClicked = (): void => {
    if (!connected && !connecting) {
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
