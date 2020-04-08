import mockDevice from "./mockDevice";
import { readAttitude } from "../../src";
import codes from "../../src/serial/codes";

describe("readAttitude", () => {
  it("should read attitude data from the device", async () => {
    mockDevice.setResponse([99, 0, 54, 1, 12, 1]);

    expect(await readAttitude("/dev/someport")).toEqual({
      heading: 268,
      pitch: 31,
      roll: 9.9,
    });

    expect(mockDevice.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_ATTITUDE,
    });
  });
});
