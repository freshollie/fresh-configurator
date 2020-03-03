import React, { useState } from "react";
import { UsbConnectIcon, UsbDisconnectIcon } from "../../icons";
import useConnected from "../../hooks/useConnected";
import {
  useConnectMutation,
  useSelectedPortQuery,
  useDisconnectMutation
} from "../../gql/__generated__";
import BigButton from "../../components/BigButton";

const ConnectControls: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const { data: configuratorQuery } = useSelectedPortQuery();
  const selectedPort = configuratorQuery?.configurator.port;

  const connected = useConnected(selectedPort || undefined);
  const [connect] = useConnectMutation({
    variables: {
      port: selectedPort ?? ""
    },
    onCompleted: () => {
      setConnecting(false);
    }
  });
  const [disconnect] = useDisconnectMutation({
    variables: {
      port: selectedPort ?? ""
    },
    onCompleted: () => {
      setConnecting(false);
    }
  });

  let statusText = "Connecting";

  if (!connecting) {
    statusText = connected ? "Disconnect" : "Connect";
  }

  const onClick = (): void => {
    if (!connected && !connecting) {
      setConnecting(true);
      connect().catch(e => {
        console.log(e);
      });
    } else {
      disconnect().catch(e => {
        console.log(e);
      });
    }
  };

  return (
    <BigButton
      active={connected}
      icon={
        !connected && !connecting ? <UsbConnectIcon /> : <UsbDisconnectIcon />
      }
      text={statusText}
      onClick={onClick}
    />
  );
};

export default ConnectControls;
