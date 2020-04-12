import React from "react";
import { Sensors } from "@fresh/msp";
import {
  GyroSensorIcon,
  AccelerometerSensorIcon,
  MagnetometerSensorIcon,
  BarometerSensorIcon,
  GpsSensorIcon,
  SonarSensorIcon,
} from "../icons";
import useSelectedPort from "../hooks/useSelectedPort";
import { useSensorsQuery, useConnectionStateQuery } from "../gql/__generated__";
import SensorStatusPanel from "../components/SensorStatusPanel";

const SENSOR_ELEMENTS = {
  [Sensors.GYRO]: [<GyroSensorIcon />, "Gyro"],
  [Sensors.ACCELEROMETER]: [<AccelerometerSensorIcon />, "Accel"],
  [Sensors.MAGNETOMETER]: [<MagnetometerSensorIcon />, "Mag"],
  [Sensors.BAROMETER]: [<BarometerSensorIcon />, "Baro"],
  [Sensors.GPS]: [<GpsSensorIcon />, "GPS"],
  [Sensors.SONAR]: [<SonarSensorIcon />, "Sonar"],
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
  const port = useSelectedPort();

  const { data: connectionData } = useConnectionStateQuery({
    variables: {
      port: port ?? "",
    },
    skip: !port,
  });

  const connected = connectionData?.device.connection.connected ?? false;

  const { data } = useSensorsQuery({
    variables: {
      port: port ?? "",
    },
    skip: !port || !connected,
  });

  if (!data || !connected) {
    return null;
  }

  return (
    <SensorStatusPanel>
      {SENSORS_ORDER.map((sensor) => (
        <li
          key={sensor}
          className={
            data.device.sensors.includes(sensor) ? "active" : undefined
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
