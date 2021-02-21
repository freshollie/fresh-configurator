import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";

const ChannelMap = gql`
  query ChannelMap($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        rc {
          receiver {
            channelMap
          }
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/ChannelMapManager").ChannelMapQuery,
  import("./__generated__/ChannelMapManager").ChannelMapQueryVariables
>;

const ChannelMapManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading, error } = useQuery(ChannelMap, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setChannelMap, { loading: setting }] = useMutation(
    gql`
      mutation SetChannelMap($connection: ID!, $map: [ID!]!) {
        deviceSetChannelMap(connectionId: $connection, channelMap: $map)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ChannelMapManager").SetChannelMapMutation,
      import("./__generated__/ChannelMapManager").SetChannelMapMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ChannelMap,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const currentMap = data?.connection.device.rc.receiver.channelMap ?? [];

  return (
    <div>
      <label htmlFor="channel-map-selector">
        Channel Map{" "}
        <select
          id="channel-map-selector"
          disabled={loading || setting || !!error}
          value={currentMap.join("")}
          onChange={(e) => {
            console.log(e.target.value.split(""));
            setChannelMap({
              variables: {
                connection: connection ?? "",
                map: e.target.value.split(""),
              },
            });
          }}
        >
          <option disabled>Select channel map</option>
          <option value="AETR1234">FrSky / Futaba / Hitec</option>
          <option value="TAER1234">Spektrum / Graupner / JR</option>
        </select>
      </label>
    </div>
  );
};

export default ChannelMapManager;
