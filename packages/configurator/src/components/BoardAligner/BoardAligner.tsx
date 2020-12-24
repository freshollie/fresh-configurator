import React from "react";
import { Axes3D } from "@betaflight/api";
import styled from "../../theme";
import droneBase from "./drone-base.jpeg";
import FlightController from "../FlightController";
import Button from "../Button";

const mod = (n: number, m: number): number => ((n % m) + m) % m;

type Props = {
  alignment: Axes3D;
  onChange?: (newAlignment: Axes3D) => unknown;
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: min-content;
`;

const DroneImage = styled.img`
  transform: rotate(90deg);
  width: 600px;
  opacity: 0.4;
`;

const BoardContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  width: 100px;
  padding: 20px;
`;

const FlipButtonContainer = styled.div`
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const BoardAligner: React.FC<Props> = ({
  alignment: { roll, pitch, yaw },
  onChange,
}) => (
  <Wrapper>
    <DroneImage src={droneBase} />

    <BoardContainer>
      <Controls>
        <Button
          onClick={() =>
            onChange?.({
              roll,
              pitch,
              yaw: mod(yaw - 90 * (roll < 180 ? 1 : -1), 360),
            })
          }
        >
          Rotate left
        </Button>
      </Controls>
      <FlightController
        orientation={yaw}
        size="medium"
        side={roll === 180 ? "bottom" : "top"}
      />
      <Controls>
        <Button
          onClick={() =>
            onChange?.({
              roll,
              pitch,
              yaw: mod(yaw + 90 * (roll < 180 ? 1 : -1), 360),
            })
          }
        >
          Rotate right
        </Button>
      </Controls>
    </BoardContainer>
    <FlipButtonContainer>
      <Controls>
        <Button
          onClick={() => onChange?.({ roll: mod(roll + 180, 360), pitch, yaw })}
        >
          Flip
        </Button>
      </Controls>
    </FlipButtonContainer>
  </Wrapper>
);

export default BoardAligner;
