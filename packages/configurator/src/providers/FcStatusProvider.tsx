import React from "react";
import useSelectedPort from "../hooks/useSelectedPort";
import useConnectionState from "../hooks/useConnectionState";

const FcStatusProvider: React.FC = () => {
  const port = useSelectedPort();
  const { connected, connecting } = useConnectionState();
};

export default FcStatusProvider;
