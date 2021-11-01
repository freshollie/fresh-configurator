import { OSDUnitTypes, writeOSDUnitMode } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";
import osdConfigData from "./osdConfigData";

describe("writeOSDUnitMode", () => {
  it("should set the osd unit mode", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponseForCode(osdConfigData, codes.MSP_OSD_CONFIG);
    mockMsp.setResponseForCode([], codes.MSP_SET_OSD_CONFIG);

    await writeOSDUnitMode("/dev/someport", OSDUnitTypes.METRIC);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-1, 2, 1, 25, 152, 8, 0, 0, 0, 0, 255, 31, 255, 31, 0, 0, 2, 2],
    });
  });
});
