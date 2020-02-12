import React from "react";
import UsbConnectIcon from "../../icons/cf_icon_usb1_white.svg";
import UsbDisconnectIcon from "../../icons/cf_icon_usb2_white.svg";
import { Container, Button } from "./BigButton.styles";

const ICON_TYPES = {
  "usb-connect": <UsbConnectIcon />,
  "usb-disconnect": <UsbDisconnectIcon />
};

const BigButton: React.FC<{
  text?: string;
  icon?: keyof typeof ICON_TYPES;
  active?: boolean;
  onClick?: () => void;
}> = ({ text, icon, active = false, onClick }) => (
  <Container>
    <Button active={active} onClick={onClick}>
      {icon && ICON_TYPES[icon]}
    </Button>
    {text && <div>{text}</div>}
  </Container>
);

export default BigButton;
