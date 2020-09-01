import React from "react";
import SensorStatusPanel from "../src/components/SensorStatusPanel";
import Icon from "../src/components/Icon";

export default {
  component: SensorStatusPanel,
  title: "Components/Sensor Status Panel",
};

export const ExampleSensors = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <Icon name="gyro-sensor" />
      <span>Gyro</span>
    </li>
    <li className="active">
      <Icon name="acc-sensor" />
      <span>Accel</span>
    </li>
    <li className="active">
      <Icon name="mag-sensor" />
      <span>Mag</span>
    </li>
    <li className="active">
      <Icon name="bar-sensor" />
      <span>Baro</span>
    </li>
    <li className="active">
      <Icon name="gps-sensor" />
      <span>GPS</span>
    </li>
    <li className="">
      <Icon name="sonar-sensor" />
      <span>Sonar</span>
    </li>
  </SensorStatusPanel>
);

export const ExampleInactiveSensors = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <Icon name="gps-sensor" />
      <span>Gyro</span>
    </li>
    <li className="active">
      <Icon name="acc-sensor" />
      <span>Accel</span>
    </li>
    <li>
      <Icon name="mag-sensor" />
      <span>Mag</span>
    </li>
    <li>
      <Icon name="bar-sensor" />
      <span>Baro</span>
    </li>
    <li className="active">
      <Icon name="gps-sensor" />
      <span>GPS</span>
    </li>
    <li>
      <Icon name="sonar-sensor" />
      <span>Sonar</span>
    </li>
  </SensorStatusPanel>
);

export const SingleItemActive = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <Icon name="gyro-sensor" />
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);

export const SingleItemInactive = (): JSX.Element => (
  <SensorStatusPanel>
    <li>
      <Icon name="gyro-sensor" />
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);
