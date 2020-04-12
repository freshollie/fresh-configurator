import React from "react";
import SensorStatusPanel from "../src/components/SensorStatusPanel";
import {
  GyroSensorIcon,
  AccelerometerSensorIcon,
  MagnetometerSensorIcon,
  BarometerSensorIcon,
  GpsSensorIcon,
  SonarSensorIcon,
} from "../src/icons";

export default {
  component: SensorStatusPanel,
  title: "Components|Sensor Status Panel",
};

export const ExampleSensors = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <GyroSensorIcon />
      <span>Gyro</span>
    </li>
    <li className="active">
      <AccelerometerSensorIcon />
      <span>Accel</span>
    </li>
    <li className="active">
      <MagnetometerSensorIcon />
      <span>Mag</span>
    </li>
    <li className="active">
      <BarometerSensorIcon />
      <span>Baro</span>
    </li>
    <li className="active">
      <GpsSensorIcon />
      <span>GPS</span>
    </li>
    <li className="">
      <SonarSensorIcon />
      <span>Sonar</span>
    </li>
  </SensorStatusPanel>
);

export const ExampleInactiveSensors = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <GyroSensorIcon />
      <span>Gyro</span>
    </li>
    <li className="active">
      <AccelerometerSensorIcon />
      <span>Accel</span>
    </li>
    <li>
      <MagnetometerSensorIcon />
      <span>Mag</span>
    </li>
    <li>
      <BarometerSensorIcon />
      <span>Baro</span>
    </li>
    <li className="active">
      <GpsSensorIcon />
      <span>GPS</span>
    </li>
    <li>
      <SonarSensorIcon />
      <span>Sonar</span>
    </li>
  </SensorStatusPanel>
);

export const SingleItemActive = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <GyroSensorIcon />
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);

export const SingleItemInactive = (): JSX.Element => (
  <SensorStatusPanel>
    <li>
      <GyroSensorIcon />
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);
