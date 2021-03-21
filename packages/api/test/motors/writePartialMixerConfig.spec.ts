import mockMsp from "../mockMsp";
import { writePartialMixerConfig } from "../../src";
import codes from "../../src/codes";

describe("writePartialMixerConfig", () => {
  it("should use the existing mixer config to write the motor direction as reversed for a v1.38.0 device", async () => {
    mockMsp.setApiVersion("1.38.0");
    mockMsp.setResponse([3, 0]);

    await writePartialMixerConfig("/dev/someport", { reversedMotors: true });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [3, 1],
    });
  });

  it("should use the existing mixer config to write the motor direction as normal for a v1.38.0 device", async () => {
    mockMsp.setApiVersion("1.38.0");
    mockMsp.setResponse([10, 1]);

    await writePartialMixerConfig("/dev/someport", { reversedMotors: false });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [10, 0],
    });
  });
});
