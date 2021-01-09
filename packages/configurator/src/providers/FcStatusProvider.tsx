import React from "react";
import useUtilisation from "../hooks/useUtilisation";
import useConnectionState from "../hooks/useConnectionState";

import { ConnectionSettingsDocument } from "../gql/queries/Configurator.graphql";
import { StatusDocument } from "../gql/queries/Device.graphql";
import { ConnectionStatsDocument } from "../gql/queries/Connection.graphql";
import StatusList from "../components/StatusList";
import { useQuery } from "../gql/apollo";

const FcStatusProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const { data: connectionSettingsData } = useQuery(ConnectionSettingsDocument);
  const baudRate = connectionSettingsData?.configurator.baudRate;
  const { connection } = useConnectionState();
  const { data: deviceStatus } = useQuery(StatusDocument, {
    variables: {
      connection: connection ?? "",
    },
    pollInterval: 1000 / refreshRate,
    skip: !connection,
  });

  const { cycleTime, cpuload, i2cError } =
    deviceStatus?.connection.device.status ?? {};

  const { data: connectionStatsData } = useQuery(ConnectionStatsDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    pollInterval: 250,
  });

  const {
    bytesRead,
    bytesWritten,
    packetErrors,
  } = connectionStatsData?.connection ?? {
    bytesRead: 0,
    bytesWritten: 0,
    packetErrors: 0,
  };

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
