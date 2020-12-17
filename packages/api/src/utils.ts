// eslint-disable-next-line import/prefer-default-export
export const bitCheck = (num: number, bit: number): boolean =>
  (num >> bit) % 2 !== 0;

type TupleOf<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
// eslint-disable-next-line @typescript-eslint/naming-convention
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export const isTupleOf = <T, N extends number>(
  list: T[],
  length: N
): list is TupleOf<T, N> => list.length === length;
