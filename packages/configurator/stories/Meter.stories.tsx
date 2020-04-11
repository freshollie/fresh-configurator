import React, { useState, useEffect } from "react";
import Meter from "../src/components/Meter";

export default {
  component: Meter,
  title: "Components|Meter",
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

const MeterDemo: React.FC<{
  max: number;
  min: number;
  step: number;
  color: string;
}> = ({ max, min, step, color }) => {
  const value = useMeterValue(min, max, step);
  return <Meter value={value} min={min} max={max} color={color} />;
};

export const Example = (): JSX.Element => (
  <MeterDemo max={2000} min={900} step={20} color="red" />
);
