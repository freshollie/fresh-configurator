import React from "react";
import { SerialPortFunctions, BAUD_RATES } from "@betaflight/api";
import useConnectionState from "../hooks/useConnectionState";
import { DevicePortSettingsDocument } from "../gql/queries/Device.graphql";
import Table from "../components/Table";
import Switch from "../components/Switch";
import { useQuery } from "../gql/apollo";

const PortSettingsManager: React.FC = () => {
  const { connection } = useConnectionState();

  const { data } = useQuery(DevicePortSettingsDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const ports = data?.connection.device.serial.ports ?? [];

  return (
    <Table>
      <thead>
        <td>Identifier</td>
        <td>Configuration/MSP</td>
        <td>Serial Rx</td>
        <td>Telemetry Output</td>
        <td>Sensor Input</td>
      </thead>
      <tbody>
        {ports.map((port) => (
          <tr key={port.id}>
            <td>UART{port.id + 1}</td>
            <td>
              <Switch
                checked={port.functions.includes(SerialPortFunctions.MSP)}
              />
              <select>
                {BAUD_RATES.slice(1).map((rate) => (
                  <option key={rate}>{rate}</option>
                ))}
              </select>
            </td>
            <td>
              <Switch
                checked={port.functions.includes(SerialPortFunctions.RX_SERIAL)}
              />
            </td>
            <td />
            <td />
            <td />
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PortSettingsManager;
