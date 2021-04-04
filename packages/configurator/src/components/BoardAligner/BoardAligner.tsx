import React from "react";
import { Axes3D } from "@betaflight/api";
import { Box, Image, Flex, Button } from "bumbag";
import droneBase from "./drone-base.jpeg";
import FlightController from "../FlightController";

const mod = (n: number, m: number): number => ((n % m) + m) % m;

type Props = {
  alignment: Axes3D;
  onChange?: (newAlignment: Axes3D) => unknown;
};

const BoardAligner: React.FC<Props> = ({
  alignment: { roll, pitch, yaw },
  onChange,
}) => (
  <Flex
    position="relative"
    alignItems="center"
    flexDirection="column"
    overflow="hidden"
  >
    <Image
      isFixed
      src={droneBase}
      width="600px"
      opacity="0.4"
      transform="rotate(90deg)"
      loading="false"
      referrerPolicy=""
    />

    <Flex
      top="0"
      position="absolute"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Box padding="major-1">
        <Button
          width="100px"
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
      </Box>
      <FlightController
        orientation={yaw}
        size="medium"
        side={roll === 180 ? "bottom" : "top"}
      />
      <Box padding="major-1">
        <Button
          width="100px"
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
      </Box>
    </Flex>
    <Flex
      justifyContent="center"
      bottom="30px"
      width="100%"
      position="absolute"
    >
      <Box padding="major-1">
        <Button
          width="100px"
          onClick={() => onChange?.({ roll: mod(roll + 180, 360), pitch, yaw })}
        >
          Flip
        </Button>
      </Box>
    </Flex>
  </Flex>
);

export default BoardAligner;
