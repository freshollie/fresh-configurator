import mockMsp from "./mockMsp";
import { writeMixerConfig } from "../src";
import codes from "../src/codes";

describe("writeMixerConfig", () => {
  it("should write the mixer config for a v1.38.0 device", async () => {
    mockMsp.setApiVersion("1.38.0");

    await writeMixerConfig("/dev/someport", { mixer: 3, reverseMotors: true });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [3, 1],
    });
  });

  it("should write the mixer config for a legacy device", async () => {
    mockMsp.setApiVersion("1.17.0");

    await writeMixerConfig("/dev/someport", {
      mixer: 10,
      reverseMotors: false,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [10],
    });
  });
});
