import { writeVtxTableBandsRow } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeVtxTableBandsRow", () => {
  it("should write the vtx table bands row", async () => {
    await writeVtxTableBandsRow("/dev/aport", {
      rowNumber: 1,
      isFactoryBand: true,
      letter: "A",
      name: "Band A",
      frequencies: [1, 2, 3],
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/aport", {
      code: codes.MSP_SET_VTXTABLE_BAND,
      data: [1, 6, 66, 97, 110, 100, 32, 65, 65, 1, 3, 1, 0, 2, 0, 3, 0],
    });
  });
});
