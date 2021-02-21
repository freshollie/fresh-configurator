export const bitCheck = (num: number, bit: number): boolean =>
  (num >> bit) % 2 !== 0;

export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type TupleOf<T, N extends number> = N extends N
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

export const fromIdentifier = <T>(
  schema: T[],
  value: T
): number | undefined => {
  const index = schema.indexOf(value);
  return index === -1 ? undefined : index;
};

export const toIdentifier = <T>(schema: T[], value: number): T | number =>
  schema[value] ?? value;

export const includeIf = <T>(statement: boolean, value: T | T[]): T[] => {
  if (statement) {
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }
  return [];
};

type RequiredAndNotNull<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

const filterUnset = <T extends Record<string, unknown>>(
  object: T
): RequiredAndNotNull<T> =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null
    )
  ) as RequiredAndNotNull<T>;

const isObject = (item: unknown): item is Record<string, unknown> =>
  !!item && typeof item === "object" && !Array.isArray(item);

type RecursivePartial<T> = {
  [P in keyof T]?:
    | (T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : // eslint-disable-next-line @typescript-eslint/ban-types
        T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P])
    | null;
};

// this is dirt, oh well
export const mergeDeep = <T>(target: T, source: RecursivePartial<T>): T => {
  if (isObject(target) && isObject(source)) {
    const output = { ...target } as typeof target;
    const sourceNoNull = filterUnset(source);
    Object.keys(sourceNoNull).forEach((key: string) => {
      if (isObject(sourceNoNull[key as keyof typeof sourceNoNull])) {
        if (!(key in target)) {
          Object.assign(output, {
            [key]: sourceNoNull[key as keyof typeof sourceNoNull],
          });
        } else {
          (output as Record<string, unknown>)[key] = mergeDeep(
            target[key],
            sourceNoNull[key as keyof typeof sourceNoNull]
          );
        }
      } else {
        Object.assign(output, {
          [key]: sourceNoNull[key as keyof typeof sourceNoNull],
        });
      }
    });

    return output;
  }
  return target;
};

export const partialWriteFunc = <T extends Record<string, unknown>, R>(
  readFunc: (port: string) => Promise<T>,
  writeFunc: (port: string, config: T) => Promise<R>
): ((port: string, config: RecursivePartial<T>) => Promise<R>) => async (
  port,
  config
) => writeFunc(port, mergeDeep(await readFunc(port), config));
