import React from "react";
import styled, { css } from "styled-components";
import image from "./image.png";

type Orientation = number;
type Side = "top" | "bottom";
type Size = "small" | "medium" | "large";
type Props = {
  orientation: Orientation;
  size: Size;
  side: Side;
};

const FCImage = styled.img<Props>`
  user-select: none;
  transform: rotate(
      ${({ orientation, side }) => orientation * (side === "top" ? 1 : -1)}deg
    )
    scaleX(${({ side }) => (side === "top" ? 1 : -1)});
  ${({ size }) =>
    size === "small" &&
    css`
      width: 100px;
    `}
  ${({ size }) =>
    size === "medium" &&
    css`
      width: 200px;
    `}
    ${({ size }) =>
    size === "large" &&
    css`
      width: 450px;
    `}
  opacity: ${({ side }) => (side === "bottom" ? 0.5 : 1)}
`;

const FlightController: React.FC<Props> = ({ orientation, size, side }) => (
  <FCImage orientation={orientation} size={size} side={side} src={image} />
);

export default FlightController;
