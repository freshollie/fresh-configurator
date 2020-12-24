import mockMsp from "./mockMsp";
import { readBoardAlignmentConfig } from "../src";
import codes from "../src/codes";

describe("readBoardAlignmentConfig", () => {
  it("should read board alignment config from the device", async () => {
    mockMsp.setResponse([99, 0, 54, 1, 12, 1]);

    expect(await readBoardAlignmentConfig("/dev/someport")).toEqual({
      yaw: 268,
      pitch: 310,
      roll: 99,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BOARD_ALIGNMENT_CONFIG,
    });
  });
});
