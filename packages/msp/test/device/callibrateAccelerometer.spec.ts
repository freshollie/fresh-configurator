import mockDevice from "./mockDevice";
import { calibrateAccelerometer } from "../../src";
import codes from "../../src/serial/codes";

describe("callibrateAccelerometer", () => {
  it("should callibrate the accelerometer for the given device", async () => {
    let timersRun = 0;
    const interval = setInterval(() => {
      jest.runTimersToTime(100);
      timersRun += 1;
    }, 10);

    jest.useFakeTimers();

    await calibrateAccelerometer("/dev/something");
    clearInterval(interval);

    expect(mockDevice.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ACC_CALIBRATION,
    });

    // expect it took at least 2000ms before execution finished
    expect(timersRun).toEqual(20);
  });
});
