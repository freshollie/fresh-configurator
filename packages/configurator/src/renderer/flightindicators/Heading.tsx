import React from "react";
import { HeadingYaw, HeadingMechanics } from "./assets";
import withBase from "./hoc/withBase";

export default withBase<{
  heading: number;
}>(({ heading }) => (
  <>
    <HeadingYaw style={{ transform: `rotate(-${heading}deg)` }} />
    <HeadingMechanics />
  </>
));
