import React from "react";
import { action } from "@storybook/addon-actions";
import HeaderBar from "../src/components/HeaderBar";
import BigButton from "../src/components/BigButton";
import styled from "../src/theme";
import ConnectionSelector from "../src/components/ConnectionSelector";

export default {
  component: HeaderBar,
  title: "Components/Header Bar",
};

const Rest = styled.div`
  background-color: black;
  height: 600px;
  width: 200px;
`;

export const withTools = (): JSX.Element => (
  <div>
    <HeaderBar>
      <div className="tools">
        <ConnectionSelector onChange={action("onChange")} />
        <BigButton />
        <BigButton />
      </div>
    </HeaderBar>
    <Rest />
  </div>
);

export const empty = (): JSX.Element => (
  <div>
    <HeaderBar />
    <Rest />
  </div>
);
