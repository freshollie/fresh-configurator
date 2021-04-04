import { Select } from "bumbag";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

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
  const connection = useConnection();
  const { data, loading, error } = useQuery(ChannelMap, {
    variables: {
      connection,
    },
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
    <Select
      disabled={loading || setting || !!error}
      value={currentMap.join("")}
      onChange={(e) => {
        setChannelMap({
          variables: {
            connection,
            map: ((e.target as unknown) as { value: string }).value.split(""),
          },
        });
      }}
      options={[
        {
          value: "",
          disabled: true,
          label: "Select channel map",
        },
        {
          value: "AETR1234",
          label: "FrSky / Futaba / Hitec",
        },
        { value: "TAER1234", label: "Spektrum / Graupner / JR" },
      ]}
    />
  );
};

export default ChannelMapManager;
