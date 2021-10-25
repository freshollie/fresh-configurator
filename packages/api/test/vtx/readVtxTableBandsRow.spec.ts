import { readVtxTableBandsRow } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVtxTableBandsRow", () => {
  it("should return the row for a v1.43.0 device", async () => {
    mockMsp.setResponseForCode(
      [
        1, 8, 66, 79, 83, 67, 65, 77, 95, 65, 65, 0, 8, 233, 22, 213, 22, 193,
        22, 173, 22, 153, 22, 133, 22, 113, 22, 93, 22,
      ],
      codes.MSP_VTXTABLE_BAND
    );
    mockMsp.setApiVersion("1.43.0");

    const row = await readVtxTableBandsRow("/someport", 1);
    expect(row).toEqual({
      rowNumber: 1,
      name: "BOSCAM_A",
      letter: "A",
      isFactoryBand: false,
      frequencies: [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725],
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/someport", {
      code: codes.MSP_VTXTABLE_BAND,
      data: [1],
    });
  });
});
