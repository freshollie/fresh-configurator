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

type TupleSizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TupleOrArray<T, N> = N extends TupleSizes ? TupleOf<T, N> : T[];

export const times = <T, N extends number>(
  f: (index: number) => T,
  number: N
): N extends TupleSizes ? TupleOf<T, N> : T[] =>
  new Array(number).fill(0).map((_, i) => f(i)) as TupleOrArray<T, N>;

type RequiredAndNotNull<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export const filterUnset = <T extends Record<string, unknown>>(
  object: T
): RequiredAndNotNull<T> =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null
    )
  ) as RequiredAndNotNull<T>;

export const unpackValues = <T>(
  mask: number,
  schema: T[],
  { inverted = false } = {}
): T[] => schema.filter((_, i) => ((mask >> i) % 2 !== 0) !== inverted);

export const packValues = <T>(
  values: T[],
  schema: T[],
  { inverted = false } = {}
): number =>
  (inverted
    ? schema.filter((bit) => !values.includes(bit))
    : values.filter((val) => schema.includes(val))
  ).reduce((acc, val) => acc | (1 << schema.indexOf(val)), 0);
