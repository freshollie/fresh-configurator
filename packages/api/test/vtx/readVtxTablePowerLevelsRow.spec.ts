import { readVtxTablePowerLevelsRow } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVtxTablePowerLevelsRow", () => {
  it("should return the row for a v1.43.0 device", async () => {
    mockMsp.setResponseForCode(
      [1, 25, 0, 3, 50, 53, 32],
      codes.MSP_VTXTABLE_POWERLEVEL
    );
    mockMsp.setApiVersion("1.43.0");

    const row = await readVtxTablePowerLevelsRow("/someport", 5);
    expect(row).toEqual({ rowNumber: 1, value: 25, label: "25 " });
    expect(mockMsp.execute).toHaveBeenCalledWith("/someport", {
      code: codes.MSP_VTXTABLE_POWERLEVEL,
      data: [5],
    });
  });
});
