import React from "react";

import ModelView from "./components/ModelView";
import { useAttitudeQuery, useSelectedPortQuery } from "./gql/__generated__";
import useConnected from "./hooks/useConnected";
import ConnectionSettings from "./managers/ConnectionSettings";
import ConnectControls from "./managers/ConnectControls";
import Navigation from "./managers/Navigation";

const ModelStatus: React.FC = () => {
  const { data: configuratorQuery } = useSelectedPortQuery();
  const port = configuratorQuery?.configurator?.port;

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      port: port || ""
    },
    pollInterval: 10,
    skip: !port
  });

  if (attitudeData) {
    return <ModelView name="quadx" attitude={attitudeData.device.attitude} />;
  }
  return null;
};

const App: React.FC = () => {
  const { data: configuratorQuery } = useSelectedPortQuery();
  const port = configuratorQuery?.configurator?.port;
  const connected = useConnected(port || undefined);

  return (
    <div>
      <Navigation />
      <div>
        {connected && <ModelStatus />}
        <ConnectionSettings />
        <ConnectControls />
      </div>
    </div>
  );
};
export default App;
