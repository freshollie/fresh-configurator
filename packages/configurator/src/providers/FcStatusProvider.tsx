import React from "react";
import useConnectionState from "../hooks/useConnectionState";
import useUtilisation from "../hooks/useUtilisation";
import useConnectionId from "../hooks/useConnectionId";

import {
  useConnectionSettingsQuery,
  useStatusQuery,
  useConnectionDetailsQuery,
} from "../gql/__generated__";
import StatusList from "../components/StatusList";

const FcStatusProvider: React.FC = () => {
  const { data: connectionSettingsData } = useConnectionSettingsQuery();
  const baudRate = connectionSettingsData?.configurator.baudRate;
  const connectionId = useConnectionId();

  const { connected } = useConnectionState();
  const { data: deviceStatus } = useStatusQuery({
    variables: {
      connection: connectionId ?? "",
    },
    pollInterval: 100,
    skip: !connectionId || !connected,
  });

  const { cycleTime, cpuload, i2cError } = deviceStatus?.device.status ?? {};

  const { data: connectionData } = useConnectionDetailsQuery({
    variables: {
      connection: connectionId ?? "",
    },
    skip: !connectionId || !connected,
    pollInterval: 250,
  });

  const { bytesRead, bytesWritten, packetErrors } = connectionData?.device
    .connection ?? { bytesRead: 0, bytesWritten: 0, packetErrors: 0 };

  // Read the sent and received bytes every second in order to
  // determine the port usage compared to the baudRate
  const readUsage = useUtilisation(bytesRead * 8, baudRate ?? 0);
  const writeUsage = useUtilisation(bytesWritten * 8, baudRate ?? 0);

  return (
    <StatusList>
      <li>
        Port utilization: U: {readUsage}% D: {writeUsage}%
      </li>
      <li>Packet error: {packetErrors}</li>
      <li>I2C error: {i2cError ?? 0}</li>
      <li>Cycle Time: {cycleTime ?? 0}</li>
      <li>CPU Load: {cpuload ?? 0}%</li>
    </StatusList>
  );
};

export default FcStatusProvider;
