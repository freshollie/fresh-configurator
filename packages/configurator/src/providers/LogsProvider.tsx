import React from "react";
import LogsView from "../components/LogsView";
import LogLine from "../components/LogLine";
import { gql, useQuery } from "../gql/apollo";

const LogsProvider: React.FC = () => {
  const { data } = useQuery(
    gql`
      query Logs {
        configurator @client {
          logs {
            time
            message
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/LogsProvider").LogsQuery,
      import("./__generated__/LogsProvider").LogsQueryVariables
    >
  );
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
