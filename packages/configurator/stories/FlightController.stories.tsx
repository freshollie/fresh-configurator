import React from "react";
import FlightController from "../src/components/FlightController";

export default {
  title: "Components/FlightController Diagram",
  component: FlightController,
};

export const zeroDegrees: React.FC = () => (
  <FlightController orientation={0} side="top" size="small" />
);
