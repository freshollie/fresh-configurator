import mockMsp from "./mockMsp";
import { Beepers, writeDshotBeeperConfig } from "../src";
import codes from "../src/codes";

describe("writeDshotBeeperConfig", () => {
  it("should write the dshot beeper config for api version 1.39.0", async () => {
    mockMsp.setApiVersion("1.39.0");
    mockMsp.setResponse([99, 0, 54, 1, 0, 1, 0, 0, 0]);

    await writeDshotBeeperConfig("/dev/someport", {
      tone: 5,
      conditions: [Beepers.RX_LOST, Beepers.RX_SET],
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_BEEPER_CONFIG,
      data: [99, 0, 54, 0, 5, 253, 253, 127, 0],
    });
  });
});
