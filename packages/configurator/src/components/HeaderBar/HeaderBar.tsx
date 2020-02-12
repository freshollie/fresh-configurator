import React from "react";
import { Container, LogoContainer, LogoSubText } from "./HeaderBar.styles";
import Logo from "../Logo";
import { version } from "../../../package.json";

const HeaderBar: React.FC = ({ children }) => (
  <Container>
    <LogoContainer>
      <Logo version={2} />
      <LogoSubText>Configurator: {version}</LogoSubText>
    </LogoContainer>
    <div>{children}</div>
  </Container>
);

export default HeaderBar;
