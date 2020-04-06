import React, { useState, useEffect } from "react";
import Attitude from "../src/flightindicators/Attitude";
import Heading from "../src/flightindicators/Heading";
import Variometer from "../src/flightindicators/Variometer";
import Airspeed from "../src/flightindicators/Airspeed";
import Altimeter from "../src/flightindicators/Altimeter";

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
    const interval = setInterval(() => {
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
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return values;
};

export const WithBoxes = (): JSX.Element => {
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
      <Attitude showBox roll={roll} pitch={pitch} />
      <Heading showBox heading={heading} />
      <Variometer showBox verticalSpeed={vario} />
      <Airspeed showBox speed={speed} />
      <Altimeter showBox altitude={altitude} pressure={pressure} />
    </>
  );
};

export const WithoutBoxes = (): JSX.Element => {
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
      <Attitude roll={roll} pitch={pitch} />
      <Heading heading={heading} />
      <Variometer verticalSpeed={vario} />
      <Airspeed speed={speed} />
      <Altimeter altitude={altitude} pressure={pressure} />
    </>
  );
};
