import React, { useEffect } from "react";
import {
  useSelectPortMutation,
  useSelectedPortQuery,
  useAvailablePortsQuery
} from "../../gql/__generated__";
import ConnectionSelector from "../../components/ConnectionSelector";

const ConnectionSettings: React.FC = () => {
  const [selectPort] = useSelectPortMutation();

  const { data: configuratorData, loading } = useSelectedPortQuery();

  const selectedPort = configuratorData?.configurator?.port;

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData, loading: loadingPorts } = useAvailablePortsQuery({
    pollInterval: !selectedPort ? 1000 : undefined
  });

  // If this is the first load, and the currently selected port is null
  // then select the first available port
  useEffect(() => {
    if (selectedPort === null && portsData?.ports) {
      selectPort({
        variables: {
          port: portsData?.ports[0]
        }
      });
    }
  }, [loading, loadingPorts, portsData, selectPort, selectedPort]);

  return (
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
  );
};

export default ConnectionSettings;
