import React from "react";
import useUtilisation from "../hooks/useUtilisation";
import useConnectionState from "../hooks/useConnectionState";
import StatusList from "../components/StatusList";
import { useQuery, gql } from "../gql/apollo";

const FcStatusProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const { data: connectionSettingsData } = useQuery(
    gql`
      query ConnectionSettings {
        configurator @client {
          port
          baudRate
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/FcStatusProvider").ConnectionSettingsQuery,
      import("./__generated__/FcStatusProvider").ConnectionSettingsQueryVariables
    >
  );
  const baudRate = connectionSettingsData?.configurator.baudRate;
  const { connection } = useConnectionState();
  const { data: deviceStatus } = useQuery(
    gql`
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
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/FcStatusProvider").StatusQuery,
      import("./__generated__/FcStatusProvider").StatusQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      pollInterval: 1000 / refreshRate,
      skip: !connection,
    }
  );

  const { cycleTime, cpuload, i2cError } =
    deviceStatus?.connection.device.status ?? {};

  const { data: connectionStatsData } = useQuery(
    gql`
      query ConnectionStats($connection: ID!) {
        connection(connectionId: $connection) {
          bytesWritten
          bytesRead
          packetErrors
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/FcStatusProvider").ConnectionStatsQuery,
      import("./__generated__/FcStatusProvider").ConnectionStatsQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      skip: !connection,
      pollInterval: 250,
    }
  );

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
