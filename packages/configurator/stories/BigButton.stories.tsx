import React from "react";
import BigButton from "../src/components/BigButton";

export default {
  component: BigButton,
  title: "Components|Big Button"
};

export const connectButton = (): JSX.Element => (
  <BigButton icon="usb-connect" text="Connect" />
);
export const disconnectButton = (): JSX.Element => (
  <BigButton icon="usb-disconnect" text="Disconnect" active />
);
