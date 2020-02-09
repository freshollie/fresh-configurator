import React from "react";

import ModelView from "./components/ModelView";
import {
  useAttitudeQuery,
  useSelectedPortQuery,
  useAvailablePortsQuery,
  useSelectPortMutation,
  useConnectedQuery,
  useConnectMutation
} from "./gql/__generated__";
import useSelectedPort from "./hooks/useSelectedPort";
import useConnected from "./hooks/useConnected";

const ModelStatus: React.FC = () => {
  const port = useSelectedPort();

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      port: port || ""
    },
    pollInterval: 10,
    skip: !port
  });

  if (attitudeData) {
    return <ModelView name="quadx" attitude={attitudeData.device.attitude} />;
  }
  return null;
};

const App: React.FC = () => {
  const selectedPort = useSelectedPort();
  const connected = useConnected(selectedPort);

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData } = useAvailablePortsQuery({
    pollInterval: !selectedPort ? 1000 : undefined
  });

  const [connect] = useConnectMutation();
  const [selectPort] = useSelectPortMutation();

  return (
    <div>
      {connected ? (
        <>
          {new Array(3).fill(true).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ModelStatus key={i} />
          ))}
        </>
      ) : (
        <>
          <label htmlFor="port-selection">
            Port
            <select
              id="port-selection"
              placeholder="Select port"
              value={selectedPort}
              onChange={e =>
                selectPort({ variables: { port: e.target.value } })
              }
            >
              {portsData?.ports.map(port => (
                <option key={port} value={port}>
                  {port}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!selectedPort}
            onClick={() =>
              selectedPort &&
              connect({
                variables: {
                  port: selectedPort
                }
              }).catch(() => {})
            }
          >
            Connect
          </button>
        </>
      )}
    </div>
  );
};
export default App;
