import { writeOSDParameters } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";
import osdConfigData from "./osdConfigData";

describe("writeOSDParameters", () => {
  it("should write the OSD paramters", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponseForCode(osdConfigData, codes.MSP_OSD_CONFIG);
    mockMsp.setResponseForCode([], codes.MSP_SET_OSD_CONFIG);
    await writeOSDParameters("/dev/someport", {
      overlayRadioMode: 3,
      cameraFrameHeight: 40,
      cameraFrameWidth: 32,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-1, 2, 1, 25, 152, 8, 0, 0, 0, 0, 255, 31, 255, 31, 0, 0, 2, 3],
    });
  });
});
