import mockMsp from "./mockMsp";
import { Features, readEnabledFeatures } from "../src";
import codes from "../src/codes";

describe("readEnabledFeatures", () => {
  it("should read the enabled features for 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([1, 132, 0, 16]);

    expect(await readEnabledFeatures("/dev/someport")).toEqual([
      Features.RX_PPM,
      Features.TELEMETRY,
      Features.RSSI_ADC,
      Features.ANTI_GRAVITY,
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_FEATURE_CONFIG,
    });
  });
});
