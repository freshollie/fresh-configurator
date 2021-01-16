import React from "react";
import { Sensors } from "@betaflight/api";
import Icon from "../components/Icon";
import useConnectionState from "../hooks/useConnectionState";
import { AvailableSensorsDocument } from "../gql/queries/Device.graphql";
import SensorStatusPanel from "../components/SensorStatusPanel";
import { useQuery } from "../gql/apollo";

const SENSOR_ELEMENTS = {
  [Sensors.GYRO]: [<Icon name="gyro-sensor" />, "Gyro"],
  [Sensors.ACCELEROMETER]: [<Icon name="acc-sensor" />, "Accel"],
  [Sensors.MAGNETOMETER]: [<Icon name="mag-sensor" />, "Mag"],
  [Sensors.BAROMETER]: [<Icon name="bar-sensor" />, "Baro"],
  [Sensors.GPS]: [<Icon name="gps-sensor" />, "GPS"],
  [Sensors.SONAR]: [<Icon name="sonar-sensor" />, "Sonar"],
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
  const { connection } = useConnectionState();

  const { data } = useQuery(AvailableSensorsDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  if (!data || !connection) {
    return null;
  }

  return (
    <SensorStatusPanel>
      {SENSORS_ORDER.map((sensor) => (
        <li
          key={sensor}
          className={
            data.connection.device.sensors.available.includes(sensor)
              ? "active"
              : undefined
          }
        >
          {SENSOR_ELEMENTS[sensor][0]}
          <span>{SENSOR_ELEMENTS[sensor][1]}</span>
        </li>
      ))}
    </SensorStatusPanel>
  );
};

export default SensorsListProvider;
