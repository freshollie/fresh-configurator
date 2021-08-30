import React from "react";
import { Image } from "bumbag";
import image from "./image.png";

type Orientation = number;
type Side = "top" | "bottom";
type Size = "small" | "medium" | "large";
type Props = {
  orientation: Orientation;
  size: Size;
  side: Side;
};

// eslint-disable-next-line consistent-return
const toWidth = (size: Size): string => {
  switch (size) {
    case "small":
      return "100px";
    case "medium":
      return "200px";
    case "large":
      return "450px";
  }
};

const FlightController: React.FC<Props> = ({ orientation, size, side }) => (
  <Image
    loading="eager"
    referrerPolicy=""
    src={image}
    transform={`rotate(
      ${orientation * (side === "top" ? 1 : -1)}deg
    ) scaleX(${side === "top" ? 1 : -1})`}
    width={toWidth(size)}
    opacity={side === "bottom" ? "0.5" : "1"}
  />
);

export default FlightController;
