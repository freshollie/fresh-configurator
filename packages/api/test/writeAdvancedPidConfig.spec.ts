import mockMsp from "./mockMsp";
import { writeAdvancedPidConfig } from "../src";
import codes from "../src/codes";

describe("writeAdvancedPidConfig", () => {
  it("should write the advanced pid config for a v1.31.0 device", async () => {
    mockMsp.setApiVersion("1.31.0");

    await writeAdvancedPidConfig("/dev/someport", {
      gyroSyncDenom: 3,
      pidProcessDenom: 2,
      useUnsyncedPwm: false,
      fastPwmProtocol: 1,
      gyroToUse: 0,
      motorPwmRate: 480,
      digitalIdlePercent: 4.5,
      gyroUse32kHz: false,
      motorPwmInversion: 0,
      gyroHighFsr: 0,
      gyroMovementCalibThreshold: 0,
      gyroCalibDuration: 0,
      gyroOffsetYaw: 0,
      gyroCheckOverflow: 0,
      debugMode: 0,
      debugModeCount: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_ADVANCED_CONFIG,
      data: [3, 2, 0, 1, 224, 1, 194, 1, 0],
    });
  });
});
