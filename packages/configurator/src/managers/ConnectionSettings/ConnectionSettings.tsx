import React, { useEffect } from "react";
import {
  useSelectPortMutation,
  useSelectedPortQuery,
  useAvailablePortsQuery
} from "../../gql/__generated__";
import ConnectionSelector from "../../components/ConnectionSelector";
import useConnected from "../../hooks/useConnected";

const ConnectionSettings: React.FC = () => {
  const [selectPort] = useSelectPortMutation();

  const { data: configuratorData, loading } = useSelectedPortQuery();
  const selectedPort = configuratorData?.configurator?.port;

  const connected = useConnected(selectedPort || undefined);

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData, loading: loadingPorts } = useAvailablePortsQuery({
    pollInterval: !connected ? 1000 : undefined,
    skip: connected
  });

  // If this is the first load, and the currently selected port is null
  // then select the first available port
  useEffect(() => {
    if (selectedPort === null && !loadingPorts) {
      selectPort({
        variables: {
          port: portsData?.ports[0] ?? "/dev/rfcomm0"
        }
      });
    }
  }, [loading, loadingPorts, portsData, selectPort, selectedPort]);

  // Only show the connection selector if we are not connected
  return !connected ? (
    <ConnectionSelector
      ports={portsData?.ports ?? undefined}
      selectedPort={selectedPort ?? undefined}
      onChange={({ port }) =>
        selectPort({
          variables: {
            port
          }
        })
      }
    />
  ) : null;
};

export default ConnectionSettings;
