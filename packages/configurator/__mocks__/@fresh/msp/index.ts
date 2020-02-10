export const isOpen = (): boolean => false;
export const open = (): Promise<boolean> => Promise.resolve(true);
export const ports = (): Promise<string[]> => Promise.resolve([]);
export const getAttitude = (): Promise<object> =>
  Promise.resolve({
    roll: 0,
    pitch: 0,
    heading: 0
  });
