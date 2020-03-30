import React, { useState, useEffect } from "react";
import Meter from "../src/components/Meter";

export default {
  component: Meter,
  title: "Components|Meter"
};

const useMeterValue = (min: number, max: number, step = 1): number => {
  const [value, setValue] = useState(min);

  useEffect(() => {
    let lastValue = min;
    let direction = 1;
    const interval = setInterval(() => {
      if (lastValue >= max) {
        direction = -1;
      }

      if (lastValue <= min) {
        direction = 1;
      }

      lastValue += step * direction;
      setValue(lastValue);
    }, 10);
    return () => clearInterval(interval);
  }, [max, min, step]);

  return value;
};

export const Example = (): JSX.Element => {
  const value = useMeterValue(900, 2000, 20);
  return <Meter value={value} min={900} max={2000} color="red" />;
};
