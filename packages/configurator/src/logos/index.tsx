import { styled, css } from "bumbag";
import LogoIcon1 from "./assets/light-wide-1.svg";
import LogoIcon2 from "./assets/light-wide-2.svg";
import LogoWhite from "./assets/cf-logo.svg";

export const Logo1 = styled(LogoIcon1)`
  .st0 {
    fill: #4f4f4f;
  }
`;

export const Logo2 = styled(LogoIcon2)`
  .st0 {
    fill: #ffbb00;
  }
  .st1 {
    fill: #ffffff;
  }
`;

export const LandingLogo = styled(LogoWhite)`
  .st0 {
    fill: #ffbb00;
  }
  .st1 {
    fill: #424242;
  }
  .st2 {
    fill: #3a3a3a;
  }
  ${({ color }) =>
    color !== "dark" &&
    css`
      path {
        stroke-opacity: 0 !important;
      }
    `}
`;
