import mockMsp from "./mockMsp";
import { Features, writeEnabledFeatures } from "../src";
import codes from "../src/codes";

describe("writeEnabledFeatures", () => {
  it("should write the enabled features for 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");

    await writeEnabledFeatures("/dev/someport", [
      Features.RX_SERIAL,
      Features.SOFTSERIAL,
      Features.DYNAMIC_FILTER,
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_FEATURE_CONFIG,
      data: [72, 0, 0, 32],
    });
  });
});
