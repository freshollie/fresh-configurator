import React, { useState, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { JSONLoader, Color, Geometry, Material } from "three";

import quadx from "./models/quad_x.model";
import tricopter from "./models/tricopter.model";
import hexx from "./models/hex_x.model";

const MODEL_MAP = {
  quadx,
  tricopter,
  hexx
};

type Model = {
  geometry: Geometry;
  materials?: Material[] | undefined;
};

export type ModelType = keyof typeof MODEL_MAP;

const useModel = (modelKey: ModelType): Model | undefined => {
  const [data, setData] = useState<Model | undefined>(undefined);

  useEffect(() => {
    fetch(MODEL_MAP[modelKey])
      .then(res => res.json())
      .then(modelData => setData(new JSONLoader().parse(modelData)))
      .catch(console.error);
  }, [modelKey]);
  return data;
};

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
  const data = useModel(name);

  if (!data) {
    return null;
  }

  const { geometry, materials } = data;

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
