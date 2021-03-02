import { Modes, writeModeRangeSlot } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("writeModeRangeSlot", () => {
  it("should write the mode range slot without extra information", async () => {
    await writeModeRangeSlot("/dev/something", 6, {
      modeId: Modes.CAMERA_CONTROL_1,
      auxChannel: 10,
      range: { start: 900, end: 1300 },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_MODE_RANGE,
      data: [6, 32, 10, 0, 16],
    });
  });

  it("should add extra mode range information if given", async () => {
    await writeModeRangeSlot("/dev/something", 6, {
      modeId: Modes.CAMERA_CONTROL_1,
      auxChannel: 10,
      range: { start: 900, end: 1300 },
      modeLogic: 1,
      linkedTo: 10,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_MODE_RANGE,
      data: [6, 32, 10, 0, 16, 1, 10],
    });
  });
});
