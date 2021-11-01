import { OSDWarnings, writeOSDWarning } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";
import osdConfigData from "./osdConfigData";

describe("writeOSDWarning", () => {
  it("should update the osd warning", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponseForCode(osdConfigData, codes.MSP_OSD_CONFIG);
    mockMsp.setResponseForCode([], codes.MSP_SET_OSD_CONFIG);

    await writeOSDWarning("/dev/someport", {
      key: OSDWarnings.FAILSAFE,
      enabled: false,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-1, 2, 1, 25, 152, 8, 0, 0, 0, 0, 255, 29, 255, 29, 0, 0, 2, 2],
    });
  });
});
