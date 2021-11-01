import { writeOSDSelectedProfile } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";
import osdConfigData from "./osdConfigData";

describe("writeOSDSelectedProfile", () => {
  it("should update the osd config to return the new selected profile index", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponseForCode(osdConfigData, codes.MSP_OSD_CONFIG);
    mockMsp.setResponseForCode([], codes.MSP_SET_OSD_CONFIG);
    await writeOSDSelectedProfile("/dev/someport", 3);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-1, 2, 1, 25, 152, 8, 0, 0, 0, 0, 255, 31, 255, 31, 0, 0, 4, 2],
    });
  });
});
