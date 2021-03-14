import { useState, useEffect, useRef } from "react";

export default (cummulativeValue: number): number => {
  const timeRef = useRef(new Date().getTime());
  const lastRef = useRef(cummulativeValue);
  const lastValue = lastRef.current;

  const [rate, setRate] = useState(0);

  useEffect(() => {
    const delta = new Date().getTime() - timeRef.current;
    if (cummulativeValue !== lastValue || delta > 1000) {
      if (cummulativeValue < lastValue) {
        setRate(0);
      } else {
        setRate(Math.round(((cummulativeValue - lastValue) / delta) * 1000));
      }
      timeRef.current = new Date().getTime();
      lastRef.current = cummulativeValue;
    }

    const timeout = setTimeout(() => {
      setRate(0);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [cummulativeValue, lastValue, setRate]);

  return rate;
};
