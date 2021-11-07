import React from "react";
import useUtilisation from "../hooks/useUtilisation";
import StatusList from "../components/StatusList";
import { useQuery, gql } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const FcStatusProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const connection = useConnection();
  const { data: deviceStatus } = useQuery(
    gql(/* GraphQL */ `
      query Status($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            status {
              cycleTime
              i2cError
              cpuload
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
      },
      pollInterval: 1000 / refreshRate,
    }
  );

  const { cycleTime, cpuload, i2cError } =
    deviceStatus?.connection.device.status ?? {};

  const { data: connectionStatsData } = useQuery(
    gql(/* GraphQL */ `
      query ConnectionStats($connection: ID!) {
        connection(connectionId: $connection) {
          baudRate
          bytesWritten
          bytesRead
          packetErrors
        }
      }
    `),
    {
      variables: {
        connection,
      },
      pollInterval: 250,
    }
  );

  const { bytesRead, bytesWritten, packetErrors, baudRate } =
    connectionStatsData?.connection ?? {
      bytesRead: 0,
      bytesWritten: 0,
      packetErrors: 0,
      baudRate: 0,
    };

  // Read the sent and received bytes every second in order to
  // determine the port usage compared to the baudRate
  const readUsage = useUtilisation(bytesRead * 8, baudRate);
  const writeUsage = useUtilisation(bytesWritten * 8, baudRate);

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
