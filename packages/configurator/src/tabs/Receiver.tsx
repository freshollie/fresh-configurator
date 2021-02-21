import React from "react";
import Title from "../components/Title";
import ChannelsListProvider from "../providers/ChannelsListProvider";
import RcModelViewProvider from "../providers/RcModelViewProvider";
import RadioPortManager from "../managers/RadioPortManager";
import RadioProtocolManager from "../managers/RadioProtocolManager";
import ChannelMapManager from "../managers/ChannelMapManager";

const ReceiverTab: React.FC = () => (
  <div className="content">
    <header>
      <Title>Receiver</Title>
    </header>
    <main>
      <RadioPortManager />
      <RadioProtocolManager />
      <ChannelMapManager />
      <ChannelsListProvider refreshRate={60} />
      <RcModelViewProvider refreshRate={60} />
    </main>
  </div>
);

export default ReceiverTab;
