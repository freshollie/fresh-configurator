import React from "react";
import styled from "styled-components";
import Widget from "../components/Widget";
import BoardAlignmentManager from "../managers/BoardAlignmentManager";
import CpuDefaultsManager from "../managers/CpuDefaultsManager";
import MotorDirectionManager from "../managers/MotorDirectionManager";

const Layout = styled.div`
  display: flex;
  flex-direction: row;

  .right {
    margin-left: 10px;
    width: 300px;

    & > * {
      margin-bottom: 10px;
    }
  }
`;

const General: React.FC = () => (
  <div className="content">
    <Layout>
      <Widget>
        <header>FC Orientation</header>
        <main>
          <BoardAlignmentManager />
        </main>
      </Widget>
      <div className="right">
        <Widget>
          <header>CPU</header>
          <main>
            <CpuDefaultsManager />
          </main>
        </Widget>
        <Widget>
          <header>Prop Direction</header>
          <main>
            <MotorDirectionManager />
          </main>
        </Widget>
      </div>
    </Layout>
  </div>
);

export default General;
