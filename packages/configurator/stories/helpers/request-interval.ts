export default (callback: () => unknown): (() => void) => {
  const requestAnimation = window.requestAnimationFrame;
  let stop = false;
  const intervalFunc = (): void => {
    callback();
    if (!stop) {
      requestAnimation(intervalFunc);
    }
  };
  requestAnimation(intervalFunc);
  return () => {
    stop = true;
  };
};
