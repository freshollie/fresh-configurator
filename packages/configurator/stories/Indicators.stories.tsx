import React, { useState, useEffect } from "react";
import AttitudeIndicator from "../src/components/flightindicators/AttitudeIndicator";

export default {
  component: AttitudeIndicator,
  title: "Components|Instruments"
};

const useRollingAttitude = (): {
  roll: number;
  pitch: number;
  heading: number;
} => {
  const [increment, setIncrement] = useState(0);
  const [number, setNumber] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(30 * Math.sin(increment / 10));
      setIncrement(increment + 1);
    }, 10);
    return () => clearInterval(interval);
  });

  return {
    roll: number,
    pitch: number,
    heading: number
  };
};

export const Attitude = (): JSX.Element => {
  const { roll, pitch } = useRollingAttitude();
  return <AttitudeIndicator size={90} roll={roll} pitch={pitch} />;
};
