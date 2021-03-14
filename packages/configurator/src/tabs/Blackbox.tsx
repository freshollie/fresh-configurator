import React from "react";
import Widget from "../components/Widget";
import BlackboxDeviceManager from "../managers/BlackboxDeviceManager";
import BlackboxFlashManager from "../managers/BlackboxFlashManager";
import BlackboxSampleRateManager from "../managers/BlackboxSampleRateManager";
import styled from "../theme";

const Layout = styled.div`
  display: flex;
`;

const Blackbox: React.FC = () => (
  <div className="content">
    <Layout>
      <Widget>
        <header>Blackbox Settings</header>
        <main>
          <BlackboxDeviceManager />
          <BlackboxSampleRateManager />
        </main>
      </Widget>
      <Widget>
        <header>Flash data</header>
        <main>
          <BlackboxFlashManager />
        </main>
      </Widget>
    </Layout>
  </div>
);

export default Blackbox;
