import React from "react";
import useConnected from "../../hooks/useConnected";
import {
  useConnectMutation,
  useSelectedPortQuery,
  useDisconnectMutation
} from "../../gql/__generated__";
import BigButton from "../../components/BigButton";

const ConnectControls: React.FC = () => {
  const { data: configuratorQuery } = useSelectedPortQuery();
  const selectedPort = configuratorQuery?.configurator.port;

  const connected = useConnected(selectedPort || undefined);
  const [connect, { loading: connecting }] = useConnectMutation({
    variables: {
      port: selectedPort || ""
    }
  });
  const [disconnect] = useDisconnectMutation({
    variables: {
      port: selectedPort || ""
    }
  });

  let statusText = "Connecting";

  if (!connecting) {
    statusText = connected ? "Disconnect" : "Connect";
  }

  return (
    <BigButton
      active={connected}
      icon={!connected || connecting ? "usb-connect" : "usb-disconnect"}
      text={statusText}
      onClick={() =>
        !connected && !connecting
          ? connect().catch(e => {
              console.log(e);
            })
          : disconnect().catch(e => {
              console.log(e);
            })
      }
    />
  );
};

export default ConnectControls;
