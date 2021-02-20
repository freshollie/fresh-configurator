import { Sensors } from "@betaflight/api";
import React from "react";
import Switch from "../components/Switch";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
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
  import("./__generated__/DisabledSensorsManager").DisabledSensorsQuery,
  import("./__generated__/DisabledSensorsManager").DisabledSensorsQueryVariables
>;

const DisabledSensorsManager: React.FC = () => {
  const { connection } = useConnectionState();
  const log = useLogger();
  const { data, loading } = useQuery(DisabledSensors, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
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
      import("./__generated__/DisabledSensorsManager").SetDisabledSensorsMutation,
      import("./__generated__/DisabledSensorsManager").SetDisabledSensorsMutationVariables
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

  const accEnabled = data
    ? !data.connection.device.sensors.disabled.includes(Sensors.ACCELEROMETER)
    : true;

  return (
    <div>
      <span>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="accelerometer-enabled-switch">Accelerometer</label>
        <Switch
          id="accelerometer-enabled-switch"
          checked={accEnabled}
          disabled={loading || !data || setting}
          onChange={(checked) => {
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
                        (v) => v !== Sensors.ACCELEROMETER
                      )
                    : [
                        ...data.connection.device.sensors.disabled,
                        Sensors.ACCELEROMETER,
                      ],
                },
              })
                .then(() => {
                  if (checked) {
                    log("Accelerometer enabled");
                  } else {
                    log("Accelerometer disabled");
                  }
                })
                .catch((e) => {
                  if (checked) {
                    log(`Could not enable accelerometer: ${e.message}`);
                  } else {
                    log(`Could not disable accelerometer: ${e.message}`);
                  }
                });
            }
          }}
        />
      </span>
    </div>
  );
};

export default DisabledSensorsManager;
