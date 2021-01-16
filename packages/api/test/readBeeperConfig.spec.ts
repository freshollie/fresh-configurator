import mockMsp from "./mockMsp";
import { readBeeperConfig } from "../src";
import codes from "../src/codes";

describe("readBeeperConfig", () => {
  it("should read the beeper config for api version 1.32.0", async () => {
    mockMsp.setApiVersion("1.32.0");
    mockMsp.setResponse([99, 0, 54, 1, 12, 1]);

    await readBeeperConfig("/dev/someport");
    // expect().toEqual({
    //   yaw: 268,
    //   pitch: 31,
    //   roll: 9.9,
    // });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BEEPER_CONFIG,
    });
  });
});
