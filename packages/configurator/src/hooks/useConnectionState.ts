import { useCallback } from "react";
import { ConnectionStateDocument } from "../gql/queries/Configurator.graphql";
import {
  SetConnectionDocument,
  SetConnectingDocument,
} from "../gql/mutations/Configurator.graphql";
import { useMutation, useQuery } from "../gql/apollo";

export default (): {
  connected: boolean;
  connecting: boolean;
  connection: string | undefined;
  setConnecting: (value: boolean) => Promise<unknown>;
  setConnection: (connectionId: string | null) => Promise<unknown>;
} => {
  const { data } = useQuery(ConnectionStateDocument);
  const [setConnection] = useMutation(SetConnectionDocument);
  const [setConnecting] = useMutation(SetConnectingDocument);

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
