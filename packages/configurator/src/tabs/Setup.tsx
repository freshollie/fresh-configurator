import React from "react";
import ModelViewProvider from "../providers/ModelViewProvider";
import ModelInstrumentsProvider from "../providers/ModelInstrumentsProvider";

import SetupLayout from "../layouts/SetupLayout";
import Widget from "../components/Widget";
import Title from "../components/Title";

const SetupTab: React.FC = () => (
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
              <ModelInstrumentsProvider />
            </main>
          </Widget>
        </aside>
      </main>
    </SetupLayout>
  </div>
);

export default SetupTab;
