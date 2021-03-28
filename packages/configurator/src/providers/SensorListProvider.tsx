import React from "react";
import { Sensors } from "@betaflight/api";
import { Icon, Tag, Set, Text, Box } from "bumbag";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const SENSOR_ELEMENTS = {
  [Sensors.GYRO]: [<Icon icon="gyro-sensor" />, "Gyro"],
  [Sensors.ACCELEROMETER]: [<Icon icon="acc-sensor" />, "Accel"],
  [Sensors.MAGNETOMETER]: [<Icon icon="mag-sensor" />, "Mag"],
  [Sensors.BAROMETER]: [<Icon icon="bar-sensor" />, "Baro"],
  [Sensors.GPS]: [<Icon icon="gps-sensor" />, "GPS"],
  [Sensors.SONAR]: [<Icon icon="sonar-sensor" />, "Sonar"],
} as const;

const SENSORS_ORDER = [
  Sensors.GYRO,
  Sensors.ACCELEROMETER,
  Sensors.MAGNETOMETER,
  Sensors.BAROMETER,
  Sensors.GPS,
  Sensors.SONAR,
] as (keyof typeof SENSOR_ELEMENTS)[];

const SensorsListProvider: React.FC = () => {
  const connection = useConnection();

  const { data } = useQuery(
    gql`
      query AvailableSensors($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            sensors {
              available
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SensorListProvider").AvailableSensorsQuery,
      import("./__generated__/SensorListProvider").AvailableSensorsQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );

  if (!data || !connection) {
    return null;
  }

  return (
    <Set>
      {SENSORS_ORDER.map((sensor) => (
        <Tag key={sensor} variant="default">
          {SENSOR_ELEMENTS[sensor][0]}
          <Text margin="minor-1">{SENSOR_ELEMENTS[sensor][1]}</Text>
          <Box
            width="7px"
            height="7px"
            backgroundColor={
              data.connection.device.sensors.available.includes(sensor)
                ? "success"
                : "danger"
            }
            borderRadius="10px"
          />
        </Tag>
      ))}
    </Set>
  );
};

export default SensorsListProvider;
