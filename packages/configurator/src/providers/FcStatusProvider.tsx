import React, { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import useConnectionState from "../hooks/useConnectionState";
import {
  useConnectionSettingsQuery,
  ConnectionDetailsQuery,
  ConnectionDetailsQueryVariables,
  ConnectionDetailsDocument,
  useStatusQuery
} from "../gql/__generated__";
import StatusList from "../components/StatusList";

const usagePercentage = (
  last: number,
  current: number,
  baudRate: number
): number => (((current - last) * 10) / baudRate) * 100;

const FcStatusProvider: React.FC = () => {
  const [usage, setUsage] = useState({ read: 0, write: 0, packetErrors: 0 });

  const client = useApolloClient();

  const { data: connectionSettingsData } = useConnectionSettingsQuery();
  const port = connectionSettingsData?.configurator.port ?? "";
  const baudRate = connectionSettingsData?.configurator.baudRate;

  const { connected } = useConnectionState(port);
  const { data: deviceStatus } = useStatusQuery({
    variables: {
      port
    },
    pollInterval: 100,
    skip: !port || !connected
  });

  const { cycleTime, cpuload, i2cError } = deviceStatus?.device.status ?? {};

  useEffect(() => {
    if (baudRate && connected) {
      let lastUsage = { read: 0, written: 0 };
      const interval = setInterval(async () => {
        const { data } = await client.query<
          ConnectionDetailsQuery,
          ConnectionDetailsQueryVariables
        >({
          query: ConnectionDetailsDocument,
          variables: {
            port
          },
          fetchPolicy: "no-cache"
        });

        const {
          bytesRead,
          bytesWritten,
          packetErrors
        } = data.device.connection;

        setUsage({
          read: usagePercentage(bytesRead, lastUsage.read, baudRate),
          write: usagePercentage(bytesWritten, lastUsage.written, baudRate),
          packetErrors
        });

        lastUsage = { read: bytesRead, written: bytesWritten };
      }, 1000);

      return () => clearInterval(interval);
    }
    setUsage({ read: 0, write: 0, packetErrors: 0 });
    return undefined;
  }, [baudRate, client, connected, port]);

  return (
    <StatusList>
      <li>
        Port utilization: U: {usage.read}% D: {usage.write}%
      </li>
      <li>Packet error: {usage.packetErrors}</li>
      <li>I2C error: {i2cError ?? 0}</li>
      <li>Cycle Time: {cycleTime ?? 0}</li>
      <li>CPU Load: {cpuload ?? 0}%</li>
    </StatusList>
  );
};

export default FcStatusProvider;
