import useRate from "./useRate";

/**
 * Get a percentage value of utilisation, based on the cumulativeValue rise
 * against the maxRate (per second).
 */
export default (cummulativeValue: number, maxRate: number): number => {
  const rate = useRate(cummulativeValue);
  const utilisation = Math.round((rate / maxRate) * 100);
  return cummulativeValue < 1 ? 0 : utilisation;
};
