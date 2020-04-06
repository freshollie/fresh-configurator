import React from "react";
import BigButton from "../src/components/BigButton";
import { UsbConnectIcon, UsbDisconnectIcon } from "../src/icons";

export default {
  component: BigButton,
  title: "Components|Big Button",
};

export const connectButton = (): JSX.Element => (
  <BigButton icon={<UsbConnectIcon />} text="Connect" />
);
export const disconnectButton = (): JSX.Element => (
  <BigButton icon={<UsbDisconnectIcon />} text="Disconnect" active />
);
