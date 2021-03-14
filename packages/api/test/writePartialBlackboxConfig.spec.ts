import { BlackboxDevices, writePartialBlackboxConfig } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("writePartialBlackboxConfig", () => {
  it("should set the blackbox config", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([1, 1, 1, 1, 32, 0]);

    await writePartialBlackboxConfig("/dev/something", {
      device: BlackboxDevices.SDCARD,
      rateNum: 1,
      pDenom: 10,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_BLACKBOX_CONFIG,
      data: [2, 1, 1, 10, 0],
    });
  });
});
