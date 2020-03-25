import React from "react";
import { Bar } from "./Meter.styles";

export interface MeterProps {
  name: string;
  value: number;
  max: number;
  min: number;
  color: string;
}

const Meter: React.FC<MeterProps> = ({ name, value, min, max, color }) => (
  <div>
    <div className="name">' + name + '</div>
    <Bar>
      <div className="meter-bar">
        <div className="label" />
        <div className="fill' + (RC.active_channels == 0 ? 'disabled' : '') + '">
          <div className="label" />
        </div>
      </div>
    </Bar>
  </div>
);

export default Meter;
