import React from "react";
import {
  Container,
  SelectorsContainer,
  ManualOverride,
  DarkSelectContainer,
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
  1200,
];

type ConnectionDetails = {
  port: string;
  baud: number;
};

const ConnectionSelector: React.FC<{
  ports?: readonly string[];
  selectedPort?: string;
  selectedBaud?: number;
  disabled?: boolean;
  onChange?: (connectionDetails: ConnectionDetails) => void;
}> = ({
  ports = [],
  selectedPort = "",
  selectedBaud = 115200,
  onChange,
  disabled = false,
}) => (
  <Container>
    {!ports.includes(selectedPort) && (
      <ManualOverride htmlFor="port-override">
        <span>Port:</span>
        <input
          disabled={disabled}
          type="text"
          value={selectedPort}
          onChange={(e) =>
            onChange?.({ port: e.target.value, baud: selectedBaud })
          }
        />
      </ManualOverride>
    )}
    <SelectorsContainer>
      <DarkSelectContainer>
        <select
          disabled={disabled}
          value={ports.includes(selectedPort) ? selectedPort : "manual"}
          onChange={(e) =>
            onChange?.({ port: e.target.value, baud: selectedBaud })
          }
        >
          {ports.map((port) => (
            <option key={port} value={port}>
              {port}
            </option>
          ))}
          <option value="manual">Manual</option>
        </select>
      </DarkSelectContainer>
      <DarkSelectContainer>
        <select
          disabled={disabled}
          value={selectedBaud}
          onChange={(e) =>
            onChange?.({
              baud: parseInt(e.target.value, 10),
              port: selectedPort,
            })
          }
        >
          {BAUDRATES.map((baud) => (
            <option key={baud} value={baud}>
              {baud}
            </option>
          ))}
        </select>
      </DarkSelectContainer>
    </SelectorsContainer>
  </Container>
);

export default ConnectionSelector;
