import React from "react";

import { Container, Button } from "./BigButton.styles";

const BigButton: React.FC<{
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}> = ({ text, icon, active = false, onClick, disabled }) => (
  <Container>
    <Button type="button" active={active} onClick={onClick} disabled={disabled}>
      {icon}
    </Button>
    {text && <div>{text}</div>}
  </Container>
);

export default BigButton;
