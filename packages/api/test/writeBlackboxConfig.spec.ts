import { BlackboxDevices, writeBlackboxConfig } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("writeBlackboxConfig", () => {
  it("should set the blackbox config", async () => {
    mockMsp.setApiVersion("1.40.0");

    await writeBlackboxConfig("/dev/something", {
      device: BlackboxDevices.FLASH,
      rateNum: 1,
      rateDenom: 1,
      pDenom: 32,
      sampleRate: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_BLACKBOX_CONFIG,
      data: [1, 1, 1, 32, 0],
    });
  });
});
