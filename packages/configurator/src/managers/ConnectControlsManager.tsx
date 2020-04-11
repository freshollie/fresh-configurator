import React from "react";
import { UsbConnectIcon, UsbDisconnectIcon } from "../icons";
import useConnectionState from "../hooks/useConnectionState";
import {
  useConnectMutation,
  useConnectionSettingsQuery,
  useDisconnectMutation,
} from "../gql/__generated__";
import BigButton from "../components/BigButton";

const ConnectControlsManager: React.FC = () => {
  const { data: configuratorQuery } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorQuery?.configurator ?? {};

  const { connected, connecting } = useConnectionState(port ?? undefined);
  const [connect] = useConnectMutation({
    variables: {
      port: port ?? "",
      baudRate: baudRate ?? 0,
    },
  });
  const [disconnect] = useDisconnectMutation({
    variables: {
      port: port ?? "",
    },
  });

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
      onClick={() => (!connected && !connecting ? connect() : disconnect())}
    />
  );
};

export default ConnectControlsManager;
