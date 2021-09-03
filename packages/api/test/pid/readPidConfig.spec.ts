import { readPidConfig } from "@betaflight/api/src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readPidConfig", () => {
  it("should return the pid config from the device", async () => {
    mockMsp.setResponse([
      46, 45, 25, 50, 50, 27, 65, 45, 0, 50, 50, 75, 40, 0, 0,
    ]);
    const config = await readPidConfig("/dev/device");

    expect(config).toEqual({
      roll: { p: 46, i: 45, d: 25 },
      pitch: { p: 50, i: 50, d: 27 },
      yaw: { p: 65, i: 45, d: 0 },
      level: { p: 50, i: 50, d: 75 },
      mag: { p: 40, i: 0, d: 0 },
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_PID,
    });
  });
});
