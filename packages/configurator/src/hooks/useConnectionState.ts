import {
  useConnectionStateQuery,
  useSetConnectionMutation,
  useSetConnectingMutation,
} from "../gql/__generated__";

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
    connected:
      !!data?.configurator.connection && !data?.configurator.connecting,
    connecting: data?.configurator.connecting ?? false,
    connection: data?.configurator.connection ?? undefined,
    setConnection: (connectionId) =>
      setConnection({
        variables: {
          connection: connectionId,
        },
      }),
    setConnecting: (value) =>
      setConnecting({
        variables: {
          value,
        },
      }),
  };
};
