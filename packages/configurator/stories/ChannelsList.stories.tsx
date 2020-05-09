import React, { useState, useEffect } from "react";
import ChannelsList from "../src/components/ChannelsList";
import requestInterval from "./helpers/request-interval";

export default {
  component: ChannelsList,
  title: "Components|Channels List",
};

const useChannelValues = (number: number): number[] => {
  const [values, setValues] = useState(new Array(number).fill(0));

  useEffect(() => {
    let lastValues = new Array(number).fill(800);
    const directions = new Array(number).fill(1);
    return requestInterval(() => {
      lastValues = lastValues.map((lastValue, i) => {
        if (lastValue >= 2200) {
          directions[i] = -1;
        }

        if (lastValue <= 800) {
          directions[i] = 1;
        }

        return lastValue + (i + 1) * directions[i];
      });
      setValues(lastValues);
    });
  }, [number]);

  return values;
};

const ChannelsDemo = (): JSX.Element => {
  const channels = useChannelValues(18);

  return <ChannelsList channels={channels} />;
};

export const AllPossibleChannels = (): JSX.Element => <ChannelsDemo />;
