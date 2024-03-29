import React from "react";
import { Beepers } from "@betaflight/api";
import { Switch } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const REQUIRED_CONDITIONS = [Beepers.RX_SET, Beepers.RX_LOST];

const BeeperConfig = gql(/* GraphQL */ `
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
`);

const BeeperManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(BeeperConfig, {
    variables: {
      connection,
    },
    skip: !connection,
  });

  const [setBeeperConfig, { loading: setting }] = useMutation(
    gql(/* GraphQL */ `
      mutation SetDshotBeeperConfig(
        $connection: ID!
        $config: DshotBeeperConfigInput!
      ) {
        deviceSetDshotBeeperConfig(connectionId: $connection, config: $config)
      }
    `),
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
    <Switch
      id="motor-beeper-switch"
      checked={active}
      label={active ? "On" : "Off"}
      disabled={loading || !data || setting}
      onChange={(e) =>
        setBeeperConfig({
          variables: {
            connection,
            config: (e.target as unknown as { checked: boolean }).checked
              ? {
                  tone: 1,
                  conditions: REQUIRED_CONDITIONS,
                }
              : {
                  tone: 0,
                  conditions: [],
                },
          },
        })
      }
    />
  );
};

export default BeeperManager;
