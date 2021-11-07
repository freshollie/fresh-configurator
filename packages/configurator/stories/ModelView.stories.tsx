import React, { useState, useEffect } from "react";
import { Box } from "bumbag";
import ModelView from "../src/renderer/components/ModelView";
import { ModelTypes } from "../src/renderer/components/Model";
import requestInterval from "./helpers/request-interval";

export default {
  component: ModelView,
  title: "Components/ModelView",
};

const useRollingAttitude = (): {
  roll: number;
  pitch: number;
  yaw: number;
} => {
  const [number, setNumber] = useState(0);
  useEffect(() => requestInterval(() => setNumber((number + 1) % 360)));

  return {
    roll: number,
    pitch: number,
    yaw: number,
  };
};

const MovingModel = ({ modelType }: { modelType: ModelTypes }): JSX.Element => (
  <ModelView attitude={useRollingAttitude()} modelType={modelType} />
);

export const QuadX = (): JSX.Element => (
  <Box height="300px">
    <MovingModel modelType="quadx" />
  </Box>
);

export const Tricopter = (): JSX.Element => (
  <Box height="300px">
    <MovingModel modelType="tricopter" />
  </Box>
);

export const HexX = (): JSX.Element => (
  <Box height="300px">
    <MovingModel modelType="hexx" />
  </Box>
);
