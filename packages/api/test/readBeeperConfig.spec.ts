import mockMsp from "./mockMsp";
import { Beepers, readBeeperConfig } from "../src";
import codes from "../src/codes";

describe("readBeeperConfig", () => {
  it("should read the beeper config for api version 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([239, 223, 127, 0, 1, 253, 253, 127, 0]);

    expect(await readBeeperConfig("/dev/someport")).toEqual({
      conditions: expect.arrayContaining([Beepers.ARMING, Beepers.MULTI_BEEPS]),
      dshot: {
        tone: 1,
        conditions: expect.arrayContaining([Beepers.RX_LOST, Beepers.RX_SET]),
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BEEPER_CONFIG,
    });
  });

  it("should not read the dshot beeper conditions for api version 1.38.0", async () => {
    mockMsp.setApiVersion("1.38.0");
    mockMsp.setResponse([239, 223, 127, 0, 1]);

    expect(await readBeeperConfig("/dev/someport")).toEqual({
      conditions: expect.arrayContaining([Beepers.ARMING, Beepers.MULTI_BEEPS]),
      dshot: {
        tone: 1,
        conditions: [],
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BEEPER_CONFIG,
    });
  });

  it("should not read the dshot beeper config for api version 1.36.0", async () => {
    mockMsp.setApiVersion("1.36.0");
    mockMsp.setResponse([239, 223, 127, 0]);

    expect(await readBeeperConfig("/dev/someport")).toEqual({
      conditions: expect.arrayContaining([Beepers.ARMING, Beepers.MULTI_BEEPS]),
      dshot: {
        tone: 0,
        conditions: [],
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BEEPER_CONFIG,
    });
  });
});
