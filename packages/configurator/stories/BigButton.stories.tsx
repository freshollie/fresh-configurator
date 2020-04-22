import React from "react";
import BigButton from "../src/components/BigButton";
import Icon from "../src/components/Icon";

export default {
  component: BigButton,
  title: "Components|Big Button",
};

export const connectButton = (): JSX.Element => (
  <BigButton icon={<Icon name="usb-connect" />} text="Connect" />
);
export const disconnectButton = (): JSX.Element => (
  <BigButton icon={<Icon name="usb-disconnect" />} text="Disconnect" active />
);
