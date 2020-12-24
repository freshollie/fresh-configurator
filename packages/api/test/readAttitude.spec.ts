import mockMsp from "./mockMsp";
import { readAttitude } from "../src";
import codes from "../src/codes";

describe("readAttitude", () => {
  it("should read attitude data from the device", async () => {
    mockMsp.setResponse([99, 0, 54, 1, 12, 1]);

    expect(await readAttitude("/dev/someport")).toEqual({
      yaw: 268,
      pitch: 31,
      roll: 9.9,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_ATTITUDE,
    });
  });
});
