import React from "react";
import SensorStatusPanel from "../src/components/SensorStatusPanel";
import { GyroSensorIcon } from "../src/icons";

export default {
  component: SensorStatusPanel,
  title: "Components|Sensor Status Panel",
};

export const SingleItemActive = (): JSX.Element => (
  <SensorStatusPanel>
    <li className="active">
      <div className="icon">
        <GyroSensorIcon />
      </div>
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);

export const SingleItemInactive = (): JSX.Element => (
  <SensorStatusPanel>
    <li>
      <div className="icon">
        <GyroSensorIcon />
      </div>
      <span>Gyro</span>
    </li>
  </SensorStatusPanel>
);
