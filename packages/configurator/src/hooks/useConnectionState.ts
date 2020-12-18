import { useCallback } from "react";
import { useConnectionStateQuery } from "../gql/queries/Configurator.graphql";
import {
  useSetConnectionMutation,
  useSetConnectingMutation,
} from "../gql/mutations/Configurator.graphql";

export default (): {
  connected: boolean;
  connecting: boolean;
  connection: string | undefined;
  setConnecting: (value: boolean) => Promise<unknown>;
  setConnection: (connectionId: string | null) => Promise<unknown>;
} => {
  const { data } = useConnectionStateQuery();
  const [setConnection] = useSetConnectionMutation();
  const [setConnecting] = useSetConnectingMutation();

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
