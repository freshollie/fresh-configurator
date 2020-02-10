import React from "react";
import { Canvas } from "react-three-fiber";
import { JSONLoader, Color } from "three";
import Paper from "../Paper";

import quadx from "./models/quad_x.json";
import tricopter from "./models/tricopter.json";
import hexx from "./models/hex_x.json";

const modelTypes = {
  quadx,
  tricopter,
  hexx
};

const models = Object.entries(modelTypes)
  .map(([key, data]) => ({ [key]: new JSONLoader().parse(data) }))
  .reduce((acc, data) => ({ ...acc, ...data }), {});

interface ModelProps {
  name: keyof typeof modelTypes;
  attitude?: {
    roll: number;
    pitch: number;
    heading: number;
  };
}

const ambientColor = new Color(0x404040);
const whiteColor = new Color(1, 1, 1);

/**
 * Create a 3D representation of the given model
 * and show what it will look like with the given
 * roll pitch and heading values
 */
const ModelView: React.FC<ModelProps> = ({
  name,
  attitude: { roll, pitch, heading } = { roll: 0, pitch: 0, heading: 0 }
}) => {
  const { geometry, materials } = models[name];

  const x = pitch * -1.0 * 0.017453292519943295;
  const y = (heading * -1.0 - 0) * 0.017453292519943295;
  const z = roll * -1.0 * 0.017453292519943295;

  return (
    <Paper>
      <Canvas camera={{ position: [0, 0, 125], fov: 60 }}>
        <ambientLight color={ambientColor} />
        <directionalLight
          color={whiteColor}
          intensity={1.5}
          position={[0, 1, 0]}
        />
        <mesh rotation-y={y}>
          <mesh
            geometry={geometry}
            material={materials}
            scale={[15, 15, 15]}
            rotation={[x, 0, z]}
          />
        </mesh>
      </Canvas>
    </Paper>
  );
};

export default ModelView;
