import React from "react";
import Meter from "../src/components/Meter";

export default {
  component: Meter,
  title: "Components|Meter"
};

export const example = (): JSX.Element => (
  <Meter name="test" value={100} min={10} max={200} color="red" />
);
