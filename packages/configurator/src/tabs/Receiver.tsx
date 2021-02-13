import React from "react";
import Title from "../components/Title";
import ChannelsListProvider from "../providers/ChannelsListProvider";
import RcModelViewProvider from "../providers/RcModelViewProvider";
import RadioPortManager from "../managers/RadioPortManager";

const ReceiverTab: React.FC = () => (
  <div className="content">
    <header>
      <Title>Receiver</Title>
    </header>
    <main>
      <RadioPortManager />
      <ChannelsListProvider refreshRate={60} />
      <RcModelViewProvider refreshRate={60} />
    </main>
  </div>
);

export default ReceiverTab;
