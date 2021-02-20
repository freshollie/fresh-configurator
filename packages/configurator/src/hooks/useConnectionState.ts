import { useCallback } from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";

export default (): {
  connected: boolean;
  connecting: boolean;
  connection: string | undefined;
  setConnecting: (value: boolean) => Promise<unknown>;
  setConnection: (connectionId: string | null) => Promise<unknown>;
} => {
  const { data } = useQuery(
    gql`
      query ConnectionState {
        configurator @client {
          connection
          connecting
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useConnectionState").ConnectionStateQuery,
      import("./__generated__/useConnectionState").ConnectionStateQueryVariables
    >
  );
  const [setConnection] = useMutation(
    gql`
      mutation SetConnection($connection: ID) {
        setConnection(connection: $connection) @client
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useConnectionState").SetConnectionMutation,
      import("./__generated__/useConnectionState").SetConnectionMutationVariables
    >
  );
  const [setConnecting] = useMutation(
    gql`
      mutation SetConnecting($value: Boolean!) {
        setConnecting(value: $value) @client
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useConnectionState").SetConnectingMutation,
      import("./__generated__/useConnectionState").SetConnectingMutationVariables
    >
  );

  return {
    connected: !!data?.configurator.connection && !data.configurator.connecting,
    connecting: data?.configurator.connecting ?? false,
    connection: data?.configurator.connection ?? undefined,
    setConnection: useCallback(
      (connectionId) =>
        setConnection({
          variables: {
            connection: connectionId,
          },
        }),
      [setConnection]
    ),
    setConnecting: useCallback(
      (value) =>
        setConnecting({
          variables: {
            value,
          },
        }),
      [setConnecting]
    ),
  };
};
