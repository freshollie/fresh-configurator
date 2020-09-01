import React from "react";
import SetupLayout from "../src/layouts/SetupLayout";
import Title from "../src/components/Title";
import Widget from "../src/components/Widget";
import ModelView from "../src/components/ModelView";
import Paper from "../src/components/Paper";
import Button from "../src/components/Button";

export default {
  component: SetupLayout,
  title: "Layouts/Setup",
};

export const example = (): JSX.Element => (
  <div className="content">
    <SetupLayout>
      <header>
        <Title>Setup</Title>
        <div className="settings">
          <div>
            <Button>Some button</Button>
            <div className="info">Some info about this button</div>
          </div>
          <div>
            <Button>Some other button</Button>
            <div className="info">Some info about this other button</div>
          </div>
          <div>
            <Button>A setting</Button>
            <Button>Another</Button>
            <div className="info">Some info about this other button</div>
          </div>
        </div>
      </header>
      <main>
        <div className="status">
          <Widget>
            <Paper>
              <ModelView modelType="quadx" />
            </Paper>
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
              <div style={{ height: "80px" }} />
            </Widget>
          </aside>
        </div>
      </main>
    </SetupLayout>
  </div>
);
