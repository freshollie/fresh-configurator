import React from "react";
import Title from "../components/Title";
import ChannelsListProvider from "../providers/ChannelsListProvider";
import RcModelViewProvider from "../providers/RcModelViewProvider";

const ReceiverTab: React.FC = () => (
  <div className="content">
    <header>
      <Title>Receiver</Title>
    </header>
    <main>
      <ChannelsListProvider />
      <RcModelViewProvider />
    </main>
  </div>
);

export default ReceiverTab;
