import mockMsp from "./mockMsp";
import { readRssiConfig } from "../src";
import codes from "../src/codes";

describe("readRssiConfig", () => {
  it("should read rssi config from the device", async () => {
    mockMsp.setResponse([5]);

    expect(await readRssiConfig("/dev/someport")).toEqual({
      channel: 5,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_RSSI_CONFIG,
    });
  });
});
