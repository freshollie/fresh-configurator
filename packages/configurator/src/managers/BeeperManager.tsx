import React from "react";
import { Beepers } from "@betaflight/api";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
import Switch from "../components/Switch";

const REQUIRED_CONDITIONS = [Beepers.RX_SET, Beepers.RX_LOST];

const BeeperConfig = gql`
  query DshotBeeperConfig($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        beeper {
          dshot {
            conditions
            tone
          }
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/BeeperManager").DshotBeeperConfigQuery,
  import("./__generated__/BeeperManager").DshotBeeperConfigQueryVariables
>;

const BeeperManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(BeeperConfig, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setBeeperConfig, { loading: setting }] = useMutation(
    gql`
      mutation SetDshotBeeperConfig(
        $connection: ID!
        $config: DshotBeeperConfigInput!
      ) {
        deviceSetDshotBeeperConfig(connectionId: $connection, config: $config)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BeeperManager").SetDshotBeeperConfigMutation,
      import("./__generated__/BeeperManager").SetDshotBeeperConfigMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: BeeperConfig,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const active =
    data?.connection.device.beeper.dshot.tone !== 0 &&
    REQUIRED_CONDITIONS.every(
      (required) =>
        !!data?.connection.device.beeper.dshot.conditions.includes(required)
    );

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="motor-beeper-switch">
        Motor beeper
        <Switch
          id="motor-beeper-switch"
          checked={active}
          disabled={loading || !data || setting}
          onChange={(checked) => {
            setBeeperConfig({
              variables: {
                connection: connection ?? "",
                config: checked
                  ? {
                      tone: 1,
                      conditions: REQUIRED_CONDITIONS,
                    }
                  : {
                      tone: 0,
                      conditions: [],
                    },
              },
            });
          }}
        />
      </label>
    </div>
  );
};

export default BeeperManager;
