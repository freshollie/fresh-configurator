import { BlackboxDevices, writeBlackboxConfig } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("writeBlackboxConfig", () => {
  it("should set the blackbox config", async () => {
    mockMsp.setApiVersion("1.40.0");

    await writeBlackboxConfig("/dev/something", {
      blackboxDevice: BlackboxDevices.FLASH,
      blackboxRateNum: 1,
      blackboxRateDenom: 1,
      blackboxPDenom: 32,
      blackboxSampleRate: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_BLACKBOX_CONFIG,
      data: [1, 1, 1, 32, 0],
    });
  });
});
