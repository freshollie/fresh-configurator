import React from "react";

import ModelView from "./ModelView";
import {
  useAttitudeQuery,
  useSelectedPortQuery,
  useAvailablePortsQuery,
  useSelectPortMutation,
  useConnectedQuery,
  useConnectMutation
} from "./gql/__generated__";

const useSelectedPort = (): string | undefined => {
  const { data: portsData } = useSelectedPortQuery();
  return portsData?.port || undefined;
};

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
    return (
      <ModelView
        name="quad_x"
        roll={attitudeData.device.attitude.roll}
        pitch={attitudeData.device.attitude.pitch}
        heading={attitudeData.device.attitude.heading}
      />
    );
  }
  return null;
};

const App: React.FC = () => {
  const selectedPort = useSelectedPort();
  const { data: connectedData } = useConnectedQuery({
    variables: {
      port: selectedPort || ""
    },
    skip: !selectedPort
  });

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData } = useAvailablePortsQuery({
    pollInterval: 1000,
    skip: !!selectedPort
  });

  const [connect] = useConnectMutation();
  const [selectPort] = useSelectPortMutation();

  return (
    <div>
      {connectedData?.device.connected ? (
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
              })
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
