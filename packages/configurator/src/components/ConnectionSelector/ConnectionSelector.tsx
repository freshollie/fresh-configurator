import React from "react";

const BAUDRATES = [
  1000000,
  500000,
  250000,
  115200,
  57600,
  38400,
  28800,
  19200,
  14400,
  9600,
  4800,
  2400,
  1200
];

const ConnectionSelector: React.FC<{
  ports?: string[];
}> = ({ ports = [] }) => (
  <div>
    <select>
      {ports.map(port => (
        <option value={port}>{port}</option>
      ))}
      <option value="manual">Manual</option>
    </select>
    <select>
      {BAUDRATES.map(baud => (
        <option value={baud}>{baud}</option>
      ))}
    </select>
  </div>
);
