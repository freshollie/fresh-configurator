import React from "react";
import { useRcChannelsQuery } from "../gql/queries/Device.graphql";
import ChannelsList from "../components/ChannelsList";
import useConnectionState from "../hooks/useConnectionState";

const ChannelValuesProvider: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useRcChannelsQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    pollInterval: 10,
  });

  const activeChannels = data?.device.rc.channels ?? [];
  const disabled = loading || activeChannels.length === 0;
  const channels: number[] =
    activeChannels.length > 0 ? activeChannels : new Array(8).fill(0);

  return <ChannelsList channels={channels} disabled={disabled} />;
};

export default ChannelValuesProvider;
