import { BlackboxDevices, readBlackboxConfig } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readBlackboxConfig", () => {
  it("should return the blackbox data", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([1, 1, 1, 1, 32, 0]);

    expect(await readBlackboxConfig("/dev/something")).toEqual({
      supported: true,
      blackboxDevice: BlackboxDevices.FLASH,
      blackboxRateNum: 1,
      blackboxRateDenom: 1,
      blackboxPDenom: 32,
      blackboxSampleRate: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_BLACKBOX_CONFIG,
    });
  });
});
