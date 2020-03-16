import styled from "../../theme";

export const SVGContainer = styled.svg`
  path {
    stroke: rgba(0, 0, 0, 0.2);
    stroke-width: 1;
    fill: #fff;
  }
  position: absolute;
  top: 0;
  left: 0;

  background-color: white;
  z-index: -1;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
