import { useState, useEffect, useRef } from "react";

/**
 * Get a percentage value of utilisation, based on the cumulativeValue rise
 * against the maxRate (per second).
 */
export default (cummulativeValue: number, maxRate: number): number => {
  const timeRef = useRef(new Date().getTime());
  const lastRef = useRef(cummulativeValue);
  const lastValue = lastRef.current;

  const [utilisation, setUtilisation] = useState(0);

  useEffect(() => {
    const delta = (new Date().getTime() - timeRef.current) / 1000;
    if (cummulativeValue > lastValue || delta >= 1) {
      setUtilisation(
        Math.round(
          (Math.abs(cummulativeValue - lastValue) / (maxRate * delta)) * 100
        )
      );
      timeRef.current = new Date().getTime();
      lastRef.current = cummulativeValue;
    }
  }, [cummulativeValue, lastValue, maxRate]);

  return cummulativeValue < 1 ? 0 : utilisation;
};
