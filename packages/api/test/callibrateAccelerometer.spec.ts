import mockMsp from "./mockMsp";
import { calibrateAccelerometer } from "../src";
import codes from "../src/codes";

describe("callibrateAccelerometer", () => {
  it("should callibrate the accelerometer for the given device", async () => {
    let timersRun = 0;
    const interval = setInterval(() => {
      try {
        jest.advanceTimersByTime(100);
      } catch (e) {}
      timersRun += 1;
    }, 10);

    jest.useFakeTimers();

    await calibrateAccelerometer("/dev/something");

    jest.useRealTimers();
    clearInterval(interval);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ACC_CALIBRATION,
    });

    // expect it took at least 2000ms before execution finished
    expect(timersRun).toEqual(20);
  });
});
