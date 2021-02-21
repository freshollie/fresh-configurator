import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";

const RssiChannelManager: React.FC = () => {
  const { connection } = useConnectionState();
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
      skip: !connection,
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
    <div>
      <label htmlFor="rssi-channel-selector">
        RSSI Channel{" "}
        <select
          value={data?.connection.device.rc.rssi.channel ?? 0}
          disabled={loading || setting}
          onChange={(e) => {
            const channel = Number(e.target.value);
            setRssiChannel({
              variables: {
                connection: connection ?? "",
                channel,
              },
            });
          }}
        >
          <option value={0}>Disabled</option>
          {
            // Don't include roll pitch yaw throttle
            new Array(data ? data.connection.device.rc.channels.length - 4 : 0)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <option key={i} value={i + 1}>
                  AUX{i + 1}
                </option>
              ))
          }
        </select>
      </label>
    </div>
  );
};

export default RssiChannelManager;
