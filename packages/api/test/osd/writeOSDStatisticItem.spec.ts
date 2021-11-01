import { OSDStatisticFields, writeOSDStatisticItem } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeOSDStatisticItem", () => {
  it("should write the config for the given statistic item", async () => {
    mockMsp.setApiVersion("1.42.0");

    await writeOSDStatisticItem("/dev/someport", {
      key: OSDStatisticFields.MAX_SPEED,
      enabled: true,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [3, 1, 0, 0],
    });
  });
});
