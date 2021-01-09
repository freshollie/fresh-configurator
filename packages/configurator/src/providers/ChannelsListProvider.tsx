import React from "react";
import { RcChannelsDocument } from "../gql/queries/Device.graphql";
import ChannelsList from "../components/ChannelsList";
import useConnectionState from "../hooks/useConnectionState";
import { useQuery } from "../gql/apollo";

const ChannelsListProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(RcChannelsDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    pollInterval: 1000 / refreshRate,
  });

  const activeChannels = data?.connection.device.rc.channels ?? [];
  const disabled = loading || activeChannels.length === 0;
  const channels: readonly number[] =
    activeChannels.length > 0 ? activeChannels : new Array(8).fill(0);

  return <ChannelsList channels={channels} disabled={disabled} />;
};

export default ChannelsListProvider;
