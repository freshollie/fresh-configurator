import React from "react";
import HeaderBar from "./components/HeaderBar";

import ConnectionSettings from "./managers/ConnectionSettings";
import ConnectControls from "./managers/ConnectControls";
import Navigation from "./managers/Navigation";
import TabRouter from "./managers/TabRouter";

import ModelViewProvider from "./providers/ModelViewProvider";
import ModelIntrumentsProvider from "./providers/ModelInstrumentsProvider";

import MainLayout from "./layouts/MainLayout";
import SetupLayout from "./layouts/SetupLayout";
import Widget from "./components/Widget";
import Title from "./components/Title";

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
          <div className="content">
            <SetupLayout>
              <header>
                <Title>Setup</Title>
              </header>
              <main>
                <Widget>
                  <ModelViewProvider />
                </Widget>
                <aside>
                  <Widget>
                    <header>Info</header>
                    <div style={{ height: "150px" }} />
                  </Widget>
                  <Widget>
                    <header>GPS</header>
                    <div style={{ height: "120px" }} />
                  </Widget>
                  <Widget>
                    <header>Instruments</header>
                    <main>
                      <ModelIntrumentsProvider />
                    </main>
                  </Widget>
                </aside>
              </main>
            </SetupLayout>
          </div>
        </div>
      </TabRouter>
    </main>
  </MainLayout>
);
export default App;
