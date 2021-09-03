import { Select } from "bumbag";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const RssiChannelManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(
    gql`
      query RssiChannelAndChannels($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            rc {
              rssi {
                channel
              }
              channels
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/RssiChannelManager").RssiChannelAndChannelsQuery,
      import("./__generated__/RssiChannelManager").RssiChannelAndChannelsQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );

  const [setRssiChannel, { loading: setting }] = useMutation(
    gql`
      mutation SetRssiChannel($connection: ID!, $channel: Int!) {
        deviceSetRssiChannel(connectionId: $connection, channel: $channel)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/RssiChannelManager").SetRssiChannelMutation,
      import("./__generated__/RssiChannelManager").SetRssiChannelMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql`
            query RcChannel($connection: ID!) {
              connection(connectionId: $connection) {
                device {
                  rc {
                    rssi {
                      channel
                    }
                  }
                }
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/RssiChannelManager").RcChannelQuery,
            import("./__generated__/RssiChannelManager").RcChannelQueryVariables
          >,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  return (
    <Select
      value={data?.connection.device.rc.rssi.channel ?? 0}
      disabled={loading || setting}
      onChange={(e) => {
        const channel = Number(
          (e.target as unknown as { value: string }).value
        );
        setRssiChannel({
          variables: {
            connection,
            channel,
          },
        });
      }}
      options={[
        { label: "Disabled", value: 0 },
        ...new Array(data ? data.connection.device.rc.channels.length - 4 : 0)
          .fill(0)
          .map((_, i) => ({ label: `AUX${i}`, value: i + 1 })),
      ]}
    />
  );
};

export default RssiChannelManager;
