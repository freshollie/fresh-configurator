import React from "react";
import { Box, Level, ProgressBar, Palette, Text, styled } from "bumbag";

const CHANNEL_MIN = 800;
const CHANNEL_MAX = 2200;
const CHANNEL_COLORS: Palette[] = ["success", "warning", "danger", "secondary"];

const CHANNEL_NAMES = ["Roll [A]", "Pitch [E]", "Yaw [R]", "Throttle [T]"];

export type ChannelsListProps = {
  channels: readonly number[];
  disabled?: boolean;
};

const NoAnimProgressBar = styled(ProgressBar)`
  * {
    transition: none !important;
  }
`;

const getChannelName = (number: number): string =>
  CHANNEL_NAMES[number] ?? `AUX ${number - CHANNEL_NAMES.length + 1}`;

const ChannelsList: React.FC<ChannelsListProps> = ({ channels, disabled }) => (
  <Box>
    {channels
      .map((value, number) => [getChannelName(number), value] as const)
      .map(([name, value], channel) => (
        <Box key={name}>
          <Level>
            <Text>{name}</Text>
            <Text>{value}</Text>
          </Level>
          <NoAnimProgressBar
            key={name}
            maxValue={CHANNEL_MAX - CHANNEL_MIN}
            value={value - CHANNEL_MIN}
            disabled={disabled}
            color={CHANNEL_COLORS[channel]}
          />
        </Box>
      ))}
  </Box>
);

export default ChannelsList;
