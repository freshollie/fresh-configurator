import { OSDAlarms, writeOSDAlarm } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";
import osdConfigData from "./osdConfigData";

describe("writeOSDAlarm", () => {
  it("should update the alarm value in the OSD Config for a v1.42.0 device", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponseForCode(osdConfigData, codes.MSP_OSD_CONFIG);
    mockMsp.setResponseForCode([], codes.MSP_SET_OSD_CONFIG);

    await writeOSDAlarm("/dev/someport", { key: OSDAlarms.RSSI, value: 69 });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-1, 2, 1, 69, 152, 8, 0, 0, 0, 0, 255, 31, 255, 31, 0, 0, 2, 2],
    });
  });
});
