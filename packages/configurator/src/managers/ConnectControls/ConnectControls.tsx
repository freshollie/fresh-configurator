import React from "react";
import useConnected from "../../hooks/useConnected";
import {
  useConnectMutation,
  useSelectedPortQuery
} from "../../gql/__generated__";
import ConnectionButton from "../../components/ConnectionButton";

const ConnectControls: React.FC = () => {
  const { data: configuratorQuery } = useSelectedPortQuery();
  const selectedPort = configuratorQuery?.configurator.port;

  const connected = useConnected(selectedPort || undefined);
  const [connect, { loading: connecting }] = useConnectMutation({
    variables: {
      port: selectedPort || ""
    }
  });

  return (
    <ConnectionButton
      connected={connected}
      connecting={connecting}
      onClick={() =>
        connect().catch(e => {
          console.log(e);
        })
      }
    />
  );
};

export default ConnectControls;
