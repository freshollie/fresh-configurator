import mockMsp from "./mockMsp";
import { writePartialAdvancedConfig } from "../src";
import codes from "../src/codes";

describe("writePartialAdvancedConfig", () => {
  it("should write the digital idle percentage for a v1.31.0 device", async () => {
    mockMsp.setApiVersion("1.31.0");
    // Respond to `readAdvancedConfig`
    mockMsp.setResponse([
      3, 2, 0, 1, 224, 1, 194, 1, 0, 0, 0, 0, 48, 125, 0, 0, 0, 2,
    ]);

    await writePartialAdvancedConfig("/dev/someport", {
      digitalIdlePercent: 10,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_ADVANCED_CONFIG,
      data: [3, 2, 0, 1, 224, 1, 232, 3, 0],
    });
  });

  it("should write the pid protocols for a v1.31.0 device", async () => {
    mockMsp.setApiVersion("1.31.0");
    // Respond to `readAdvancedConfig`
    mockMsp.setResponse([
      3, 2, 0, 1, 224, 1, 194, 1, 0, 0, 0, 0, 48, 125, 0, 0, 0, 2,
    ]);

    await writePartialAdvancedConfig("/dev/someport", {
      gyroSyncDenom: 10,
      gyroUse32kHz: true,
      fastPwmProtocol: 5,
      pidProcessDenom: 4,
      useUnsyncedPwm: true,
      motorPwmRate: 8,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_ADVANCED_CONFIG,
      data: [10, 4, 1, 5, 8, 0, 194, 1, 1],
    });
  });

  it("should allow pid partial protocol properties to be given", async () => {
    mockMsp.setApiVersion("1.31.0");
    // Respond to `readAdvancedConfig`
    mockMsp.setResponse([
      3, 2, 0, 1, 224, 1, 194, 1, 0, 0, 0, 0, 48, 125, 0, 0, 0, 2,
    ]);

    await writePartialAdvancedConfig("/dev/someport", {
      gyroSyncDenom: 10,
      fastPwmProtocol: 5,
      pidProcessDenom: 4,
      useUnsyncedPwm: null,
      motorPwmRate: 8,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_ADVANCED_CONFIG,
      data: [10, 4, 0, 5, 8, 0, 194, 1, 0],
    });
  });
});
