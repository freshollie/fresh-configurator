import React from "react";
import UsbConnectIcon from "../../icons/cf_icon_usb1_white.svg";
import UsbDisconnectIcon from "../../icons/cf_icon_usb2_white.svg";
import { Container, Button } from "./ConnectionButton.styles";

const ConnectionButton: React.FC<{
  connected?: boolean;
  connecting?: boolean;
  onClick?: () => void;
}> = ({ connected = false, connecting = false, onClick }) => (
  <Container>
    <Button active={connected || connecting} onClick={onClick}>
      {connected || connecting ? <UsbConnectIcon /> : <UsbDisconnectIcon />}
    </Button>
    <div>
      {connected && "Disconnect"}
      {connecting && "Connecting"}
      {!connected && !connecting && "Connect"}
    </div>
  </Container>
);

export default ConnectionButton;
