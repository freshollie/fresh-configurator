import React from "react";
import styled from "styled-components";
import SetupLayout from "../src/layouts/SetupLayout";
import Title from "../src/components/Title";
import Widget from "../src/components/Widget";
import ModelView from "../src/components/ModelView";
import Paper from "../src/components/Paper";

export default {
  component: SetupLayout,
  title: "Layouts|Setup",
};

const WhiteBackground = styled.div`
  background-color: white;
`;

export const example = (): JSX.Element => (
  <WhiteBackground className="content">
    <SetupLayout>
      <header>
        <Title>Setup</Title>
      </header>
      <main>
        <Widget>
          <Paper>
            <ModelView modelType="quadx" />
          </Paper>
        </Widget>
        <aside>
          <Widget>
            <header>Info</header>
            <div style={{ height: "150px" }} />
          </Widget>
          <Widget>
            <header>GPS</header>
            <div style={{ height: "120px" }} />
          </Widget>
          <Widget>
            <header>Instruments</header>
            <div style={{ height: "80px" }} />
          </Widget>
        </aside>
      </main>
    </SetupLayout>
  </WhiteBackground>
);
