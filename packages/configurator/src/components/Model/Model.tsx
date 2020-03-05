import React from "react";
import { Canvas } from "react-three-fiber";
import { JSONLoader, Color } from "three";

import quadx from "./models/quad_x.json";
import tricopter from "./models/tricopter.json";
import hexx from "./models/hex_x.json";

const MODEL_MAP = {
  quadx,
  tricopter,
  hexx
};

const models = Object.entries(MODEL_MAP)
  .map(([key, data]) => ({ [key]: new JSONLoader().parse(data) }))
  .reduce((acc, data) => ({ ...acc, ...data }), {});

export type ModelType = keyof typeof MODEL_MAP;

interface ModelProps {
  name: ModelType;
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
const Model: React.FC<ModelProps> = ({
  name,
  attitude: { roll, pitch, heading } = { roll: 0, pitch: 0, heading: 0 }
}) => {
  const { geometry, materials } = models[name];

  const x = pitch * -1.0 * (Math.PI / 180);
  const y = (heading * -1.0 - 0) * (Math.PI / 180);
  const z = roll * -1.0 * (Math.PI / 180);

  return (
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
  );
};

export default Model;
