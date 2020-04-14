// eslint-disable-next-line import/prefer-default-export
export const bitCheck = (num: number, bit: number): boolean =>
  (num >> bit) % 2 !== 0;
