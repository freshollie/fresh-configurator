import React from "react";
import { action } from "@storybook/addon-actions";
import ConnectionSelector from "../src/components/ConnectionSelector";

export default {
  component: ConnectionSelector,
  title: "Components|ConnectionSelector"
};

export const noPortsAvailable = (): JSX.Element => (
  <ConnectionSelector onChange={action("onChange")} />
);

export const availablePorts = (): JSX.Element => (
  <ConnectionSelector
    onChange={action("onChange")}
    ports={["/dev/something", "/dev/anotherthing"]}
  />
);

export const portSelected = (): JSX.Element => (
  <ConnectionSelector
    onChange={action("onChange")}
    selectedPort="/dev/something"
    ports={["/dev/something", "/dev/anotherthing"]}
  />
);
