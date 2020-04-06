import React from "react";
import {
  Container,
  LogoContainer,
  LogoSubText,
  Children,
} from "./HeaderBar.styles";
import { Logo2 } from "../../logos";
import { version } from "../../../package.json";

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
