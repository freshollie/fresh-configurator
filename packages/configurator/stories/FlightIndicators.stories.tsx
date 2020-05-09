import React, { useState, useEffect } from "react";
import Attitude from "../src/flightindicators/Attitude";
import Heading from "../src/flightindicators/Heading";
import Variometer from "../src/flightindicators/Variometer";
import Airspeed from "../src/flightindicators/Airspeed";
import Altimeter from "../src/flightindicators/Altimeter";
import requestInterval from "./helpers/request-interval";

export default {
  component: Attitude,
  title: "Components|Flight Indicators",
};

const useIndicatorValues = (): {
  roll: number;
  pitch: number;
  heading: number;
  vario: number;
  speed: number;
  altitude: number;
  pressure: number;
} => {
  const [values, setValues] = useState({
    roll: 0,
    pitch: 0,
    heading: 0,
    vario: 0,
    altitude: 0,
    speed: 0,
    pressure: 0,
  });
  useEffect(() => {
    let increment = 0;
    return requestInterval(() => {
      setValues({
        roll: 30 * Math.sin(increment / 10),
        pitch: 50 * Math.sin(increment / 20),
        heading: increment,
        vario: 2 * Math.sin(increment / 10),
        speed: 80 + 80 * Math.sin(increment / 10),
        altitude: 10 * increment,
        pressure: 1000 + 3 * Math.sin(increment / 50),
      });

      increment += 1;
    });
  }, []);

  return values;
};

const FlightIndicatorsDemo = ({
  showBox,
}: {
  showBox: boolean;
}): JSX.Element => {
  const {
    roll,
    pitch,
    heading,
    vario,
    speed,
    altitude,
    pressure,
  } = useIndicatorValues();
  return (
    <>
      <Attitude showBox={showBox} roll={roll} pitch={pitch} />
      <Heading showBox={showBox} heading={heading} />
      <Variometer showBox={showBox} verticalSpeed={vario} />
      <Airspeed showBox={showBox} speed={speed} />
      <Altimeter showBox={showBox} altitude={altitude} pressure={pressure} />
    </>
  );
};

export const WithBoxes = (): JSX.Element => <FlightIndicatorsDemo showBox />;

export const WithoutBoxes = (): JSX.Element => (
  <FlightIndicatorsDemo showBox={false} />
);
