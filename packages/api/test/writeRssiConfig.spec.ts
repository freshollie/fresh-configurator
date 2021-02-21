import mockMsp from "./mockMsp";
import { writeRssiConfig } from "../src";
import codes from "../src/codes";

describe("writeRssiConfig", () => {
  it("should write rssi config to the device", async () => {
    await writeRssiConfig("/dev/someport", {
      channel: 5,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_RSSI_CONFIG,
      data: [5],
    });
  });
});
