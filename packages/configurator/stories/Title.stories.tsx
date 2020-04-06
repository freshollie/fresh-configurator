import React from "react";
import styled from "styled-components";
import Title from "../src/components/Title";

const WhiteBackground = styled.div`
  background-color: white;
  height: 100vh;
`;

export default {
  component: Title,
  title: "Components|Title",
};

export const asTitle = (): JSX.Element => (
  <WhiteBackground>
    <Title>Hello world</Title>
  </WhiteBackground>
);
