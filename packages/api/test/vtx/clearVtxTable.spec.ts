import { clearVtxTable } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("clearVtxTable", () => {
  it("should clear the vtx table config by writing to the 'clearTable' property", async () => {
    mockMsp.setApiVersion("1.43.0");
    mockMsp.setResponseForCode(
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 8, 5],
      codes.MSP_VTX_CONFIG
    );
    mockMsp.setResponseForCode([], codes.MSP_SET_VTX_CONFIG);

    await clearVtxTable("/dev/something");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_VTX_CONFIG,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 5, 1],
    });
  });
});
