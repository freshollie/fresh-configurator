import React, { useState, useEffect } from "react";
import {
  connect,
  getAttitude,
  Kinematics,
  ports,
  isConnected
} from "@fresh/msp";
import ModelView from "./ModelView";

const App: React.FC = () => {
  const [attitude, setAttitude] = useState<Kinematics>({
    roll: 0,
    pitch: 0,
    heading: 0
  });
  const [port, setPort] = useState();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected && port) {
      const interval = setInterval(async () => {
        const attitude = await getAttitude(port);
        setAttitude(attitude);
      }, 10);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [connected, port]);

  return (
    <div>
      <ModelView
        name="quad_x"
        roll={attitude.roll}
        pitch={attitude.pitch}
        heading={attitude.heading}
      />
      <button
        onClick={async () => {
          const port = (await ports())[1];
          setPort(port);
          await connect(port);
          setConnected(true);
        }}
      >
        Connect
      </button>
      {connected && <div>{JSON.stringify(attitude)}</div>}
    </div>
  );
};
export default App;
