import React from "react";
import ConnectionButton from "../src/components/ConnectionButton";

export default {
  component: ConnectionButton,
  title: "Components|ConnectionButton"
};

export const disconnected = (): JSX.Element => <ConnectionButton />;
export const connected = (): JSX.Element => <ConnectionButton connected />;
export const connecting = (): JSX.Element => <ConnectionButton connecting />;
