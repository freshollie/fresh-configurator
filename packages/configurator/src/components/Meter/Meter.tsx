import React from "react";
import { Bar, BarLabel } from "./Meter.styles";

export interface MeterProps {
  value: number;
  max: number;
  min: number;
  color: string;
}

const Meter: React.FC<MeterProps> = ({ value, min, max, color }) => {
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  return (
    <Bar color={color} percentage={percentage}>
      <BarLabel percentage={percentage}>{clampedValue}</BarLabel>
    </Bar>
  );
};

export default Meter;
