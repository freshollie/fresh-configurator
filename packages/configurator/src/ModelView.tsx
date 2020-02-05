import React, { Suspense } from "react";
import { Canvas, useLoader, Loader } from "react-three-fiber";
import {
  BufferGeometryLoader,
  BufferGeometry,
  MaterialLoader,
  Material,
  ObjectLoader,
  JSONLoader
} from "three";
import { join } from "path";
import quadx from "./models/quad_x.json";

interface ModelProps {
  name: "quad_x" | "tricopter";
  roll?: number;
  pitch?: number;
  heading?: number;
}

const { geometry, materials } = new JSONLoader().parse(quadx);

const ModelView: React.FC<ModelProps> = ({
  name,
  roll = 0,
  pitch = 0,
  heading = 0
}) => {
  const x = pitch * -1.0 * 0.017453292519943295;
  const y = (heading * -1.0 - 0) * 0.017453292519943295;
  const z = roll * -1.0 * 0.017453292519943295;
  return (
    <Canvas>
      <mesh rotation-y={y} position={[0, 0, -125]}>
        <mesh
          position={[0, 0, 0]}
          geometry={geometry}
          material={materials}
          scale={[15, 15, 15]}
          rotation={[x, 0, z]}
        />
      </mesh>
    </Canvas>
  );
};

export default ModelView;
