import styled, { css } from "../../theme";

export const Wrapper = styled.div`
  position: relative;
`;

export const LogsList = styled.div<{ open?: boolean }>`
  border: 0px solid silver; /* was 1px*/
  background-color: #242424;
  color: rgba(255, 255, 255, 0.6);
  line-height: 21px;
  height: 27px; /* was 65*/
  overflow-y: hidden; /* scroll*/

  ${({ open }) =>
    open &&
    css`
      overflow-y: auto;
      box-shadow: inset 0 0 15px #000000;
      height: 200px;
    `}
`;

export const OpenSwitch = styled.a`
  position: absolute;
  top: 0;
  right: 0;

  color: #656565 !important;
  transition: all 0.3s;

  &:hover {
    color: #959595 !important;
    text-decoration: none !important;
    transition: all 0.3s;
  }
`;
