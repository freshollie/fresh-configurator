import React from "react";
import Title from "../src/components/Title";

export default {
  component: Title,
  title: "Components|Title",
};

export const asTitle = (): JSX.Element => <Title>Hello world</Title>;
