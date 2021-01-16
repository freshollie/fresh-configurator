import mockMsp from "./mockMsp";
import { readDisabledSensors, Sensors } from "../src";
import codes from "../src/codes";

describe("readDisabledSensors", () => {
  it("should read the disabled sensors", async () => {
    mockMsp.setResponse([0, 1, 0]);

    expect(await readDisabledSensors("/dev/someport")).toEqual(
      expect.arrayContaining([Sensors.BAROMETER])
    );

    mockMsp.setResponse([1, 1, 0]);

    expect(await readDisabledSensors("/dev/someport")).toEqual(
      expect.arrayContaining([Sensors.ACCELEROMETER, Sensors.BAROMETER])
    );

    mockMsp.setResponse([1, 1, 1]);
    expect(await readDisabledSensors("/dev/someport")).toEqual(
      expect.arrayContaining([
        Sensors.ACCELEROMETER,
        Sensors.BAROMETER,
        Sensors.MAGNETOMETER,
      ])
    );

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SENSOR_CONFIG,
    });
  });
});
