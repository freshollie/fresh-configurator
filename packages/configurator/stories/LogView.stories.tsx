import React from "react";
import LogsView from "../src/components/LogsView";
import LogLine from "../src/components/LogLine";

export default {
  component: LogsView,
  title: "Components|Logs View"
};

export const example = (): JSX.Element => (
  <LogsView>
    {new Array(20).map((_, i) => (
      <LogLine time={new Date()}>Some Log {i}</LogLine>
    ))}
  </LogsView>
);
