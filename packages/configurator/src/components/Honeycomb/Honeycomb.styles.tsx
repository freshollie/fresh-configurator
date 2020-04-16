import styled, { css } from "../../theme";

export const SVGContainer = styled.svg`
  path {
    stroke: ${({ theme }) =>
      theme.dark ? css`rgba(255, 255, 255, 0.8)` : css`rgba(0, 0, 0, 0.4)`};

    stroke-width: 1;
    fill: ${({ theme }) => (theme.dark ? theme.colors.secondary : "#fff")};
  }
  position: absolute;
  top: 0;
  left: 0;

  background-color: ${({ theme }) =>
    theme.dark ? theme.colors.secondary : "white"};

  z-index: -1;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
