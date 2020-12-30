import React from "react";
import styled from "styled-components";
import Widget from "../components/Widget";
import BoardAlignmentManager from "../managers/BoardAlignmentManager";
import CpuDefaultsManager from "../managers/CpuDefaultsManager";

const Layout = styled.div``;

const General: React.FC = () => (
  <div className="content">
    <Layout>
      <Widget>
        <header>FC Orientation</header>
        <main>
          <BoardAlignmentManager />
        </main>
      </Widget>
      <Widget>
        <header>CPU</header>
        <main>
          <CpuDefaultsManager />
        </main>
      </Widget>
    </Layout>
  </div>
);

export default General;
