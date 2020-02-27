import React from "react";
import Widget from "../src/components/Widget";
import Attitude from "../src/flightindicators/Attitude";
import Heading from "../src/flightindicators/Heading";

export default {
  component: Widget,
  title: "Components|Widget"
};

export const grey = (): JSX.Element => (
  <Widget>
    <header>Instruments</header>
    <main>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Attitude size={90} roll={0} pitch={0} />
        <Heading size={90} heading={0} />
      </div>
    </main>
  </Widget>
);
