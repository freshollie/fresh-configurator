import React from "react";
import Widget from "../src/components/Widget";
import Attitude from "../src/flightindicators/Attitude";
import Heading from "../src/flightindicators/Heading";
import Table from "../src/components/Table";

export default {
  component: Widget,
  title: "Components|Widget",
};

export const instruments = (): JSX.Element => (
  <Widget>
    <header>Instruments</header>
    <main>
      <Attitude size={90} roll={0} pitch={0} />
      <Heading size={90} heading={0} />
    </main>
  </Widget>
);

export const table = (): JSX.Element => (
  <Widget>
    <header>Instruments</header>
    <main>
      <Table>
        <tbody>
          <tr>
            <td>Something</td>
            <td>Something else</td>
          </tr>
          <tr>
            <td>Some new line</td>
            <td>some other variable</td>
          </tr>
        </tbody>
      </Table>
    </main>
  </Widget>
);
