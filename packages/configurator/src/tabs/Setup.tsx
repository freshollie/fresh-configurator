import React from "react";
import FcSummaryProvider from "../providers/FcSummaryProvider";
import GpsSummaryProvider from "../providers/GpsSummaryProvider";
import AccelerometerCallibrationManager from "../managers/AccelerometerCallibrationManager";
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
        <AccelerometerCallibrationManager />
        <div className="status">
          <Widget>
            <ModelViewProvider />
          </Widget>
          <aside>
            <Widget>
              <header>Info</header>
              <main>
                <FcSummaryProvider />
              </main>
            </Widget>
            <Widget>
              <header>GPS</header>
              <main>
                <GpsSummaryProvider />
              </main>
            </Widget>
            <Widget>
              <header>Instruments</header>
              <main>
                <ModelInstrumentsProvider />
              </main>
            </Widget>
          </aside>
        </div>
      </main>
    </SetupLayout>
  </div>
);

export default SetupTab;
