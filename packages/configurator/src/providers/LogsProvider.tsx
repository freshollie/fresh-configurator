import React from "react";
import LogsView from "../components/LogsView";
import LogLine from "../components/LogLine";
import { useLogsQuery } from "../gql/__generated__";

const LogsProvider: React.FC = () => {
  const { data } = useLogsQuery();
  return (
    <LogsView>
      {data?.configurator.logs.map(({ time, message }) => (
        <LogLine key={time + message} time={new Date(time)}>
          {message}
        </LogLine>
      ))}
    </LogsView>
  );
};

export default LogsProvider;
