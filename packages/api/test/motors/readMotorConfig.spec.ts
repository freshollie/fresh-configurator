import { readMotorConfig } from "@betaflight/api/src";
import mockMsp from "../mockMsp";

describe("readMotorConfig", () => {
  it("should return the motor config from the board for a v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([46, 4, 208, 7, 232, 3]);
    const config = await readMotorConfig("/dev/athing");

    expect(config).toEqual({
      minThrottle: 1070,
      maxThrottle: 2000,
      minCommand: 1000,
      motorCount: 0,
      motorPoles: 0,
      useDshotTelemetry: false,
      useEscSensor: false,
    });
  });
});
