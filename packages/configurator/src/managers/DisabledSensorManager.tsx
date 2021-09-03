import { Sensors } from "@betaflight/api";
import React from "react";
import { Switch } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";
import useLogger from "../hooks/useLogger";

const DisabledSensors = gql`
  query DisabledSensors($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        sensors {
          disabled
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/DisabledSensorManager").DisabledSensorsQuery,
  import("./__generated__/DisabledSensorManager").DisabledSensorsQueryVariables
>;

const DisabledSensorManager: React.FC<{ sensor: Sensors }> = ({ sensor }) => {
  const connection = useConnection();
  const log = useLogger();
  const { data, loading } = useQuery(DisabledSensors, {
    variables: {
      connection,
    },
  });

  const [setDisabledSensors, { loading: setting }] = useMutation(
    gql`
      mutation SetDisabledSensors($connection: ID!, $disabledSensors: [Int!]!) {
        deviceSetDisabledSensors(
          connectionId: $connection
          disabledSensors: $disabledSensors
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/DisabledSensorManager").SetDisabledSensorsMutation,
      import("./__generated__/DisabledSensorManager").SetDisabledSensorsMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: DisabledSensors,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const enabled = data
    ? !data.connection.device.sensors.disabled.includes(sensor)
    : true;

  return (
    <Switch
      checked={enabled}
      label={enabled ? "Enabled" : "Disabled"}
      disabled={loading || !data || setting}
      onChange={(event) => {
        const { checked } = event.target as unknown as { checked: boolean };
        if (data && connection) {
          if (checked) {
            log("Enabling accelerometer");
          } else {
            log("Disabling accelerometer");
          }
          setDisabledSensors({
            variables: {
              connection,
              disabledSensors: checked
                ? data.connection.device.sensors.disabled.filter(
                    (v) => v !== sensor
                  )
                : [...data.connection.device.sensors.disabled, sensor],
            },
          })
            .then(() => {
              if (checked) {
                log(`${Sensors[sensor]} enabled`);
              } else {
                log(`${Sensors[sensor]} disabled`);
              }
            })
            .catch((e) => {
              if (checked) {
                log(`Could not enable ${Sensors[sensor]}: ${e.message}`);
              } else {
                log(`Could not disable ${Sensors[sensor]}: ${e.message}`);
              }
            });
        }
      }}
    />
  );
};

export default DisabledSensorManager;
