import React from "react";
import { Sensors } from "@betaflight/api";
import { Icon, Tag, Set, Text } from "bumbag";
import {
  faAtom,
  faCompass,
  faSatellite,
  faThermometerHalf,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const SENSOR_ELEMENTS = {
  [Sensors.GYRO]: [{ icon: faAtom, type: "font-awesome" }, "Gyro"],
  [Sensors.ACCELEROMETER]: [{ icon: "acc-sensor" }, "Accel"],
  [Sensors.MAGNETOMETER]: [{ icon: faCompass, type: "font-awesome" }, "Mag"],
  [Sensors.BAROMETER]: [
    { icon: faThermometerHalf, type: "font-awesome" },
    "Baro",
  ],
  [Sensors.GPS]: [{ icon: faSatellite, type: "font-awesome" }, "GPS"],
  [Sensors.SONAR]: [
    {
      icon: faWifi,
      transform: "rotate(180deg)",
      type: "font-awesome",
    },
    "Sonar",
  ],
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
          <Icon
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...SENSOR_ELEMENTS[sensor][0]}
            color={
              data.connection.device.sensors.available.includes(sensor)
                ? undefined
                : "gray"
            }
          />
          <Text
            margin="minor-1"
            color={
              data.connection.device.sensors.available.includes(sensor)
                ? undefined
                : "gray"
            }
          >
            {SENSOR_ELEMENTS[sensor][1]}
          </Text>
        </Tag>
      ))}
    </Set>
  );
};

export default SensorsListProvider;
