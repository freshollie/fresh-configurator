import React from "react";
import HeaderBar from "../src/components/HeaderBar";
import BigButton from "../src/components/BigButton";
import styled from "../src/theme";

export default {
  component: HeaderBar,
  title: "Components|Header Bar"
};

const Rest = styled.div`
  background-color: black;
  height: 600px;
  width: 200px;
`;

export const empty = (): JSX.Element => (
  <div>
    <HeaderBar>
      <BigButton />
    </HeaderBar>
    <Rest />
  </div>
);
