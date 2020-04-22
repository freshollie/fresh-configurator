import React from "react";

import { Container, RoundButton } from "./BigButton.styles";

const BigButton: React.FC<{
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  "data-testid"?: string;
  onClick?: () => void;
}> = ({
  text,
  icon,
  active = false,
  onClick,
  disabled,
  "data-testid": testId,
}) => (
  <Container>
    <RoundButton
      data-testid={testId}
      type="button"
      active={active}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </RoundButton>
    {text && <div>{text}</div>}
  </Container>
);

export default BigButton;
