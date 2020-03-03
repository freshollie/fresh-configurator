import React from "react";
import HeaderBar from "./components/HeaderBar";

import ConnectionSettings from "./managers/ConnectionSettings";
import ConnectControls from "./managers/ConnectControls";
import Navigation from "./managers/Navigation";
import TabRouter from "./managers/TabRouter";

import ModelViewProvider from "./providers/ModelViewProvider";
import ModelIntrumentsProvider from "./providers/ModelInstrumentsProvider";

import MainLayout from "./components/MainLayout";
import Widget from "./components/Widget";

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
      <nav>
        <Navigation />
      </nav>
      <TabRouter>
        <div id="landing">This is some landing page</div>
        <div id="setup">
          <div style={{ height: "300px" }}>
            <ModelViewProvider />
          </div>
          <Widget>
            <ModelIntrumentsProvider />
          </Widget>
        </div>
      </TabRouter>
    </main>
  </MainLayout>
);
export default App;
