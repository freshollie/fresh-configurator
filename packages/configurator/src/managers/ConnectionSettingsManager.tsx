import React, { useEffect } from "react";
import { AvailablePortsDocument } from "../gql/queries/Connection.graphql";
import { ConnectionSettingsDocument } from "../gql/queries/Configurator.graphql";
import { SetConnectionSettingsDocument } from "../gql/mutations/Configurator.graphql";
import ConnectionSelector from "../components/ConnectionSelector";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import { useMutation, useQuery } from "../gql/apollo";

const ConnectionSettingsManager: React.FC = () => {
  const [updateSettings] = useMutation(SetConnectionSettingsDocument);

  const log = useLogger();

  const { data: configuratorData, loading } = useQuery(
    ConnectionSettingsDocument
  );
  const { port, baudRate } = configuratorData?.configurator ?? {};

  const { connected, connecting } = useConnectionState();

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData, loading: loadingPorts } = useQuery(
    AvailablePortsDocument,
    {
      pollInterval: 1000,
      skip: connected,
      onError: (e) => {
        log(`Error reading available ports: ${e.message}`);
      },
    }
  );

  // If this is the first load, and the currently selected port is null
  // then select the first available port
  useEffect(() => {
    if (port === null && !loadingPorts) {
      updateSettings({
        variables: {
          port: portsData?.ports[0] ?? "/dev/rfcomm0",
        },
      });
    }
  }, [loading, loadingPorts, port, portsData, updateSettings]);

  // Only show the connection selector if we are not connected
  return !connected ? (
    <ConnectionSelector
      ports={portsData?.ports ?? undefined}
      selectedPort={port ?? undefined}
      selectedBaud={baudRate}
      disabled={connecting}
      onChange={({ port: newPort, baud }) =>
        updateSettings({
          variables: {
            port: newPort,
            baudRate: baud,
          },
        })
      }
    />
  ) : null;
};

export default ConnectionSettingsManager;
