import styled, { css } from "../../theme";
import Icon from "../Icon";

export const Wrapper = styled.div`
  position: relative;
`;

export const LogsList = styled.div<{ open?: boolean }>`
  border: 0px solid silver; /* was 1px*/
  background-color: #242424;
  color: rgba(255, 255, 255, 0.6);
  line-height: 21px;
  height: 21px; /* was 65*/
  overflow-y: hidden; /* scroll*/
  transition: all 0.2s;
  padding-left: 10px;
  padding-bottom: 5px;

  ${({ open }) =>
    open &&
    css`
      overflow-y: auto;
      box-shadow: inset 0 0 15px #000000;
      height: 125px;
    `}
`;

export const OpenSwitch = styled.a`
  position: absolute;
  top: 2px;
  right: 20px;
  cursor: pointer;
  user-select: none;

  color: #656565 !important;
  transition: all 0.3s;

  &:hover {
    color: #959595 !important;
    text-decoration: none !important;
    transition: all 0.3s;
  }
`;

export const ScrollIcon = styled(Icon)<{ open?: boolean }>`
  position: absolute;
  right: 10px;
  height: 27px;
  width: 27px;
  opacity: 0;
  pointer-events: none;
  transition: all ease 0.3s;

  ${({ open }) =>
    open &&
    css`
      height: 110px;
      margin-top: 10px;
      margin-right: 20px;
      width: 110px;
      opacity: 0.15;
      background-size: 80%;
      box-shadow: inset 0 0 5px #000000;
      transition: all ease 0.3s;
    `}
`;
