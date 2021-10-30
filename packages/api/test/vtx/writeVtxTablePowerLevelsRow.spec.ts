import { writeVtxTablePowerLevelsRow } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeVtxTablePowerLevelsRow", () => {
  it("should set the vtx table power level row", async () => {
    await writeVtxTablePowerLevelsRow("/dev/someport", {
      rowNumber: 50,
      label: "DUM",
      value: 120,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_VTXTABLE_POWERLEVEL,
      data: [50, 120, 0, 3, 68, 85, 77],
    });
  });
});
