import React from "react";
import ChannelsList from "../components/ChannelsList";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const ChannelsListProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const connection = useConnection();
  const { data, loading } = useQuery(
    gql`
      query RcChannels($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            rc {
              channels
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ChannelsListProvider").RcChannelsQuery,
      import("./__generated__/ChannelsListProvider").RcChannelsQueryVariables
    >,
    {
      variables: {
        connection,
      },
      pollInterval: 1000 / refreshRate,
    }
  );

  const activeChannels = data?.connection.device.rc.channels ?? [];
  const disabled = loading || activeChannels.length === 0;
  const channels: readonly number[] =
    activeChannels.length > 0 ? activeChannels : new Array(8).fill(0);

  return <ChannelsList channels={channels} disabled={disabled} />;
};

export default ChannelsListProvider;
