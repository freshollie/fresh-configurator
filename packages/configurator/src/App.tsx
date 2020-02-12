import React from "react";

import ModelView from "./components/ModelView";
import HeaderBar from "./components/HeaderBar";

import { useAttitudeQuery, useSelectedPortQuery } from "./gql/__generated__";
import useConnected from "./hooks/useConnected";
import ConnectionSettings from "./managers/ConnectionSettings";
import ConnectControls from "./managers/ConnectControls";
import Navigation from "./managers/Navigation";
import MainLayout from "./components/MainLayout";

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
    <MainLayout>
      <header>
        <HeaderBar>
          <div style={{ display: "flex" }}>
            <ConnectionSettings />
            <ConnectControls />
          </div>
        </HeaderBar>
      </header>
      <main>
        <Navigation />
        <div>{connected && <ModelStatus />}</div>
      </main>
    </MainLayout>
  );
};
export default App;
