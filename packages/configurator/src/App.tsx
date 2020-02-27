import React from "react";
import HeaderBar from "./components/HeaderBar";

import ConnectionSettings from "./managers/ConnectionSettings";
import ConnectControls from "./managers/ConnectControls";
import Navigation from "./managers/Navigation";
import TabRouter from "./managers/TabRouter";

import ModelViewProvider from "./providers/ModelViewProvider";
import ModelIntrumentsProvider from "./providers/ModelInstrumentsProvider";

import MainLayout from "./components/MainLayout";

const App: React.FC = () => (
  <MainLayout>
    <header>
      <HeaderBar>
        <div className="tools">
          <ConnectionSettings />
          <ConnectControls />
        </div>
      </HeaderBar>
    </header>
    <main>
      <Navigation />
      <TabRouter>
        <div id="landing">This is some landing page</div>
        <div id="setup">
          <ModelViewProvider />
          <ModelIntrumentsProvider />
        </div>
      </TabRouter>
    </main>
  </MainLayout>
);
export default App;
