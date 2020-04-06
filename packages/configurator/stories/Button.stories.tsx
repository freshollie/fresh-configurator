import React from "react";
import Button from "../src/components/Button";

export default {
  component: Button,
  title: "Components|Button",
};

export const normal = (): JSX.Element => <Button>Some text</Button>;

export const disabled = (): JSX.Element => (
  <Button disabled>Some disabled button</Button>
);
