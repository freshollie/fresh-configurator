import { useConnectionStateQuery } from "../gql/__generated__";

export default (): {
  connected: boolean;
  connecting: boolean;
  connection: string | undefined;
} => {
  const { data } = useConnectionStateQuery();

  return {
    connected: !!data?.configurator.connection,
    connecting: data?.configurator.connecting ?? false,
    connection: data?.configurator.connection ?? undefined,
  };
};
