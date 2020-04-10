import React, { useEffect } from "react";
import {
  useSetConnectionSettingsMutation,
  useConnectionSettingsQuery,
  useAvailablePortsQuery,
} from "../gql/__generated__";
import ConnectionSelector from "../components/ConnectionSelector";
import useConnectionState from "../hooks/useConnectionState";

const ConnectionSettingsManager: React.FC = () => {
  const [updateSettings] = useSetConnectionSettingsMutation();

  const { data: configuratorData, loading } = useConnectionSettingsQuery();
  const { port, baudRate } = configuratorData?.configurator ?? {};

  const { connected, connecting } = useConnectionState(port || undefined);

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData, loading: loadingPorts } = useAvailablePortsQuery({
    pollInterval: !connected ? 1000 : undefined,
    skip: connected,
  });

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
