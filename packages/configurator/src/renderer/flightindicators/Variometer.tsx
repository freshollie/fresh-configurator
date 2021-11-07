import React from "react";

import { FiNeedle, VerticalMechanics } from "./assets";
import withBase from "./hoc/withBase";

const VARIO_LIMIT = 1.95;

const boundedSpeed = (vario: number): number =>
  Math.max(-VARIO_LIMIT, Math.min(VARIO_LIMIT, vario));

export default withBase<{
  verticalSpeed: number;
}>(({ verticalSpeed }) => (
  <>
    <VerticalMechanics />
    <FiNeedle
      style={{ transform: `rotate(${boundedSpeed(verticalSpeed) * 90}deg)` }}
    />
  </>
));
