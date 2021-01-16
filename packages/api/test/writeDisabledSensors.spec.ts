import mockMsp from "./mockMsp";
import { Sensors, writeDisabledSensors } from "../src";
import codes from "../src/codes";

describe("writeDisabledSensors", () => {
  it("should write the disabled sensors", async () => {
    await writeDisabledSensors("/dev/someport", [
      Sensors.MAGNETOMETER,
      Sensors.ACCELEROMETER,
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_SENSOR_CONFIG,
      data: [1, 0, 1],
    });
  });
});
