import { OSDTimerSources, writeOSDTimer } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeOSDTimer", () => {
  it("should set the given timers settings", async () => {
    mockMsp.setApiVersion("1.42.0");

    await writeOSDTimer("/dev/someport", {
      key: 1,
      src: OSDTimerSources.TOTAL_ARMED_TIME,
      precision: 10,
      time: 56,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [-2, 1, 161, 56],
    });
  });
});
