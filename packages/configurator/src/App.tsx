import React from "react";
import SensorsListProvider from "./providers/SensorListProvider";
import HeaderBar from "./components/HeaderBar";

import ConnectionSettingsManager from "./managers/ConnectionSettingsManager";
import ConnectionManager from "./managers/ConnectionManager";
import NavigationManager from "./managers/NavigationManager";
import { TabRouter } from "./routing";

import FcStatusProvider from "./providers/FcStatusProvider";
import LogsProvider from "./providers/LogsProvider";
import MainLayout from "./layouts/MainLayout";

import Setup from "./tabs/Setup";
import Landing from "./tabs/Landing";
import Receiver from "./tabs/Receiver";
import General from "./tabs/General";

const App: React.FC = () => (
  <MainLayout>
    <header>
      <HeaderBar>
        <div className="tools">
          <SensorsListProvider />
          <ConnectionSettingsManager />
          <ConnectionManager />
        </div>
      </HeaderBar>
      <LogsProvider />
    </header>
    <main>
      <nav>
        <NavigationManager />
      </nav>
      <div className="tab-content">
        <TabRouter>
          <div id="general">
            <General />
          </div>
          <div id="landing">
            <Landing />
          </div>
          <div id="setup">
            <Setup />
          </div>
          <div id="receiver">
            <Receiver />
          </div>
        </TabRouter>
      </div>
    </main>
    <footer>
      <div>
        <FcStatusProvider refreshRate={10} />
      </div>
    </footer>
  </MainLayout>
);

export default App;
