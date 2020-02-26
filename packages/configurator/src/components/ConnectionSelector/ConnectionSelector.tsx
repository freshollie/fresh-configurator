import React from "react";
import {
  Container,
  SelectorsContainer,
  ManualOverride,
  DarkSelectContainer
} from "./ConnectionSelector.styles";

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

interface ConnectionDetails {
  port: string;
  baud: number;
}

const ConnectionSelector: React.FC<{
  ports?: string[];
  selectedPort?: string;
  selectedBaud?: number;
  onChange?: (connectionDetails: ConnectionDetails) => void;
}> = ({
  ports = [],
  selectedPort = "/dev/rfcomm0",
  selectedBaud = 115200,
  onChange
}) => (
  <Container>
    {!ports?.includes(selectedPort) && (
      <ManualOverride htmlFor="port-override">
        <span>Port:</span>
        <input
          type="text"
          value={selectedPort}
          onChange={e =>
            onChange?.({ port: e.target.value, baud: selectedBaud })
          }
        />
      </ManualOverride>
    )}
    <SelectorsContainer>
      <DarkSelectContainer>
        <select
          value={selectedPort}
          onChange={e =>
            onChange?.({ port: e.target.value, baud: selectedBaud })
          }
        >
          {ports.map(port => (
            <option value={port}>{port}</option>
          ))}
          <option value="/dev/rfcomm0">Manual</option>
        </select>
      </DarkSelectContainer>
      <DarkSelectContainer>
        <select
          value={selectedBaud}
          onChange={e =>
            onChange?.({
              baud: parseInt(e.target.value, 10),
              port: selectedPort
            })
          }
        >
          {BAUDRATES.map(baud => (
            <option value={baud}>{baud}</option>
          ))}
        </select>
      </DarkSelectContainer>
    </SelectorsContainer>
  </Container>
);

export default ConnectionSelector;
