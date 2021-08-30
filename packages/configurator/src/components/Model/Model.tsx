import React, { Suspense } from "react";
import { Canvas, PrimitiveProps, useLoader } from "@react-three/fiber";
import { Color } from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import quadx from "./models/quad_x.gltf";
import tricopter from "./models/tricopter.gltf";
import hexx from "./models/hex_x.gltf";

const MODEL_MAP = {
  quadx,
  tricopter,
  hexx,
};

export type ModelTypes = keyof typeof MODEL_MAP;

type ModelProps = {
  name: ModelTypes;
  /**
   * The attitude which the model should
   * represent, in degrees
   */
  attitude?: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  /**
   * Are the attitude values the raw
   * degrees for each axis, defaults to false
   */
  rawAttitude?: boolean;
};

const ambientColor = new Color(0x404040);
const whiteColor = new Color(1, 1, 1);

const GltfAsset: React.FC<
  { file: string } & Omit<PrimitiveProps, "object">
> = ({ file, ...primitiveProps }) => {
  const gltf = useLoader(GLTFLoader, file);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <primitive {...primitiveProps} object={gltf.scene} />;
};

/**
 * Create a 3D representation of the given model
 * and show what it will look like with the given
 * roll pitch and yaw values
 */
const Model: React.FC<ModelProps> = ({
  name,
  attitude: { roll, pitch, yaw } = { roll: 0, pitch: 0, yaw: 0 },
  rawAttitude = false,
}) => {
  const x = pitch * -1.0 * (Math.PI / 180);
  const y = (yaw * -1.0 - 0) * (Math.PI / 180);
  const z = roll * -1.0 * (Math.PI / 180);
  const file = MODEL_MAP[name];

  return (
    <Canvas camera={{ position: [0, 0, 125], fov: 60 }}>
      <ambientLight color={ambientColor} />
      <directionalLight
        color={whiteColor}
        intensity={1.5}
        position={[0, 1, 0]}
      />
      <Suspense fallback={null}>
        {rawAttitude ? (
          <GltfAsset file={file} scale={[15, 15, 15]} rotation={[x, y, z]} />
        ) : (
          <mesh rotation-y={y}>
            <GltfAsset file={file} scale={[15, 15, 15]} rotation={[x, 0, z]} />
          </mesh>
        )}
      </Suspense>
    </Canvas>
  );
};

export default Model;
