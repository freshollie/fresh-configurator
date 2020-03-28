import React from "react";
import useSelectedPort from "../hooks/useSelectedPort";
import { useRcChannelsQuery } from "../gql/__generated__";
import ChannelsList from "../components/ChannelsList";

const ChannelValuesProvider: React.FC = () => {
  const port = useSelectedPort();
  const { data, loading } = useRcChannelsQuery({
    variables: {
      port: port ?? ""
    },
    skip: !port,
    pollInterval: 10
  });

  const activeChannels = data?.device.rc.channels ?? [];
  const disabled = loading || activeChannels.length === 0;
  const channels: number[] =
    activeChannels.length > 0 ? activeChannels : new Array(8).fill(0);

  return <ChannelsList channels={channels} disabled={disabled} />;
};

export default ChannelValuesProvider;
