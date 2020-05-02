import React from "react";

import { SpeedMechanics, FiNeedle } from "./assets";
import withBase from "./hoc/withBase";

const AIRSPEED_LIMIT_H = 160;
const AIRSPEED_LIMIT_L = 0;

const boundedSpeed = (speed: number): number =>
  Math.max(AIRSPEED_LIMIT_L, Math.min(AIRSPEED_LIMIT_H, speed));

export default withBase<{
  speed: number;
}>(({ speed }) => (
  <>
    <SpeedMechanics />
    <FiNeedle
      data-testid="indicator-needle"
      style={{ transform: `rotate(${90 + boundedSpeed(speed) * 2}deg)` }}
    />
  </>
));
