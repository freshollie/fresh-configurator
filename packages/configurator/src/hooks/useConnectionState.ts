import {
  useConnectionStateSubscription,
  useIsConnectingQuery,
} from "../gql/__generated__";
import useConnectionId from "./useConnectionId";

export default (): {
  connected: boolean;
  connecting: boolean;
  connection: string | undefined;
} => {
  const connectionId = useConnectionId();
  const { data } = useConnectionStateSubscription({
    variables: {
      connection: connectionId ?? "",
    },
    skip: !connectionId,
  });

  const { data: connectingData } = useIsConnectingQuery();

  return {
    connected: data?.connected ?? false,
    connecting: connectingData?.configurator.connecting ?? false,
    connection: connectionId,
  };
};
