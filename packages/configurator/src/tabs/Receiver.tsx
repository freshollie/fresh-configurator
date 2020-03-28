import React from "react";
import Title from "../components/Title";
import ChannelsListProvider from "../providers/ChannelsListProvider";

const ReceiverTab: React.FC = () => (
  <div className="content">
    <header>
      <Title>Receiver</Title>
    </header>
    <main>
      <ChannelsListProvider />
    </main>
  </div>
);

export default ReceiverTab;
