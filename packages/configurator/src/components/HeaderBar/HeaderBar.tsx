import React from "react";
import {
  Container,
  LogoContainer,
  LogoSubText,
  Children,
} from "./HeaderBar.styles";
import { Logo2 } from "../../logos";
import { versionInfo } from "../../util";

const { version } = versionInfo();

const HeaderBar: React.FC = ({ children }) => (
  <Container>
    <LogoContainer>
      <Logo2 />
      <LogoSubText>Configurator: {version}</LogoSubText>
    </LogoContainer>
    <Children>{children}</Children>
  </Container>
);

export default HeaderBar;
