import React from "react";

import {
  AltitudePressure,
  AltitudeTicks,
  FiNeedleSmall,
  FiNeedle
} from "./assets";
import withBase from "./hoc/withBase";

export default withBase<{
  pressure: number;
  altitude: number;
}>(({ pressure, altitude }) => (
  <>
    <AltitudePressure
      style={{ transform: `rotate(${2 * pressure - 1980}deg)` }}
    />
    <AltitudeTicks />
    <FiNeedleSmall
      style={{ transform: `rotate(${(altitude / 10000) * 360}deg)` }}
    />
    <FiNeedle
      className="needle box"
      style={{
        transform: `rotate(${90 + ((altitude % 1000) * 360) / 1000}deg)`
      }}
    />
  </>
));
