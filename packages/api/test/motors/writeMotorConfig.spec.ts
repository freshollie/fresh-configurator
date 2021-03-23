import { writeMotorConfig } from "@betaflight/api/src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeMotorConfig", () => {
  it("should set the motor config for a v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    await writeMotorConfig("/dev/device", {
      minThrottle: 1070,
      maxThrottle: 2000,
      minCommand: 1001,
      motorCount: 0,
      motorPoles: 0,
      useDshotTelemetry: false,
      useEscSensor: false,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_SET_MOTOR_CONFIG,
      data: [46, 4, 208, 7, 233, 3],
    });
  });
});
