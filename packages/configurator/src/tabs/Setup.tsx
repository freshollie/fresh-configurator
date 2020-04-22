import React from "react";
import FcSummaryProvider from "../providers/FcSummaryProvider";
import GpsSummaryProvider from "../providers/GpsSummaryProvider";
import AccelerometerCallibrationManager from "../managers/AccelerometerCallibrationManager";
import ModelViewProvider from "../providers/ModelViewProvider";
import ModelInstrumentsProvider from "../providers/ModelInstrumentsProvider";

import SetupLayout from "../layouts/SetupLayout";
import Widget from "../components/Widget";
import Title from "../components/Title";
import ResetManager from "../managers/ResetManager";

const SetupTab: React.FC = () => (
  <div className="content">
    <SetupLayout>
      <header>
        <Title>Setup</Title>
        <div className="settings">
          <div>
            <AccelerometerCallibrationManager />
            <div className="info">Some info about this button</div>
          </div>
          <div>
            <ResetManager />
            <div className="info">
              Restore settings to <b>default</b>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="status">
          <Widget>
            <ModelViewProvider refreshRate={60} />
          </Widget>
          <aside>
            <Widget>
              <header>Info</header>
              <main>
                <FcSummaryProvider refreshRate={10} />
              </main>
            </Widget>
            <Widget>
              <header>GPS</header>
              <main>
                <GpsSummaryProvider refreshRate={10} />
              </main>
            </Widget>
            <Widget>
              <header>Instruments</header>
              <main>
                <ModelInstrumentsProvider refreshRate={60} />
              </main>
            </Widget>
          </aside>
        </div>
      </main>
    </SetupLayout>
  </div>
);

export default SetupTab;
