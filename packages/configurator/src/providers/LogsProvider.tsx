import React from "react";
import LogsView from "../components/LogsView";
import LogLine from "../components/LogLine";
import { LogsDocument } from "../gql/queries/Configurator.graphql";
import { useQuery } from "../gql/apollo";

const LogsProvider: React.FC = () => {
  const { data } = useQuery(LogsDocument);
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
