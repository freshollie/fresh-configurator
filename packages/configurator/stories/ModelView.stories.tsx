import React, { useState, useEffect } from "react";
import styled from "../src/theme";
import ModelView from "../src/components/ModelView";
import { ModelTypes } from "../src/components/Model";

export default {
  component: ModelView,
  title: "Components|ModelView",
};

const Container = styled.div`
  height: 310px;
`;

const useRollingAttitude = (): {
  roll: number;
  pitch: number;
  heading: number;
} => {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setNumber((number + 1) % 360), 10);
    return () => clearInterval(interval);
  });

  return {
    roll: number,
    pitch: number,
    heading: number,
  };
};

const MovingModel = ({ modelType }: { modelType: ModelTypes }): JSX.Element => (
  <ModelView attitude={useRollingAttitude()} modelType={modelType} />
);

export const QuadX = (): JSX.Element => (
  <Container>
    <MovingModel modelType="quadx" />
  </Container>
);

export const Tricopter = (): JSX.Element => (
  <Container>
    <MovingModel modelType="tricopter" />
  </Container>
);

export const HexX = (): JSX.Element => (
  <Container>
    <MovingModel modelType="hexx" />
  </Container>
);
