import React from "react";
import Meter from "../Meter";
import { Wrapper, Name } from "./ChannelsList.styles";

const CHANNEL_MIN = 800;
const CHANNEL_MAX = 2200;
const CHANNEL_COLORS = [
  "#f1453d",
  "#673fb4",
  "#2b98f0",
  "#1fbcd2",
  "#159588",
  "#50ae55",
  "#cdda49",
  "#fdc02f",
  "#fc5830",
  "#785549",
  "#9e9e9e",
  "#617d8a",
  "#cf267d",
  "#7a1464",
  "#3a7a14",
  "#14407a",
];

const CHANNEL_NAMES = ["Roll [A]", "Pitch [E]", "Yaw [R]", "Throttle [T]"];

export type ChannelsListProps = {
  channels: readonly number[];
  disabled?: boolean;
};

const ChannelsList: React.FC<ChannelsListProps> = ({ channels, disabled }) => {
  const getChannelName = (number: number): string =>
    CHANNEL_NAMES[number] ?? `AUX ${number - CHANNEL_NAMES.length + 1}`;

  return (
    <Wrapper>
      <div>
        {channels.map((_, number) => (
          <Name key={getChannelName(number)}>{getChannelName(number)}</Name>
        ))}
      </div>
      <div className="meters">
        {channels.map((value, number) => (
          <Meter
            key={getChannelName(number)}
            max={CHANNEL_MAX}
            min={CHANNEL_MIN}
            value={value}
            color={disabled ? "grey" : CHANNEL_COLORS[number] ?? "green"}
          />
        ))}
      </div>
    </Wrapper>
  );
};

export default ChannelsList;
