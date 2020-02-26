import styled, { css } from "styled-components";

// eslint-disable-next-line import/prefer-default-export
export const Instrument = styled.div<{ size?: number }>`
  ${({ size = 250 }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
  position: relative;
  display: inline-block;
  overflow: hidden;

  div,
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
