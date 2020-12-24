import mockMsp from "./mockMsp";
import { writeBoardAlignmentConfig } from "../src";
import codes from "../src/codes";

describe("writeBoardAlignmentConfig", () => {
  it("should write the given config", async () => {
    await writeBoardAlignmentConfig("/dev/somewrite", {
      roll: 10,
      pitch: -180,
      yaw: 20,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somewrite", {
      code: codes.MSP_SET_BOARD_ALIGNMENT_CONFIG,
      data: [10, 0, 76, -1, 20, 0],
    });
  });
});
