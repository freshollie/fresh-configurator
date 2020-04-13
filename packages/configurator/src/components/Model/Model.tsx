import React, { useState, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { JSONLoader, Color, Geometry, Material } from "three";

import quadx from "./models/quad_x.model";
import tricopter from "./models/tricopter.model";
import hexx from "./models/hex_x.model";

interface Model {
  geometry: Geometry;
  materials?: Material[] | undefined;
}

const MODEL_MAP = {
  quadx,
  tricopter,
  hexx,
};

export type ModelTypes = keyof typeof MODEL_MAP;
const modelsCache = {} as Record<ModelTypes, Model | undefined>;

/**
 * Load the given model
 */
const useModelData = (modelKey: ModelTypes): Model | undefined => {
  const [data, setData] = useState<Model | undefined>(undefined);

  useEffect(() => {
    if (modelsCache[modelKey]) {
      setData(modelsCache[modelKey]);
    } else {
      fetch(MODEL_MAP[modelKey])
        .then((res) => res.json())
        .then((modelData) => {
          modelsCache[modelKey] = new JSONLoader().parse(modelData);
          setData(modelsCache[modelKey]);
        })
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
  }, [modelKey]);
  return data;
};

interface ModelProps {
  name: ModelTypes;
  /**
   * The attitude which the model should
   * represent, in degrees
   */
  attitude?: {
    roll: number;
    pitch: number;
    heading: number;
  };
  /**
   * Are the attitude values the raw
   * degrees for each axis, defaults to false
   */
  rawAttitude?: boolean;
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
  attitude: { roll, pitch, heading } = { roll: 0, pitch: 0, heading: 0 },
  rawAttitude = false,
}) => {
  const data = useModelData(name);

  // Don't display anything until the model is loaded
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
      {rawAttitude ? (
        <mesh
          geometry={geometry}
          material={materials}
          scale={[15, 15, 15]}
          rotation={[x, y, z]}
        />
      ) : (
        <mesh rotation-y={y}>
          <mesh
            geometry={geometry}
            material={materials}
            scale={[15, 15, 15]}
            rotation={[x, 0, z]}
          />
        </mesh>
      )}
    </Canvas>
  );
};

export default Model;
