import { FilterTypes, writePartialFilterConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writePartialFilterConfig", () => {
  it("should allow parts of the filter config to be set for v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponseForCode(
      [
        100,
        100,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        160,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        100,
        0,
        44,
        1,
        0,
        0,
        200,
        0,
      ],
      codes.MSP_FILTER_CONFIG
    );
    mockMsp.setResponseForCode([], codes.MSP_SET_FILTER_CONFIG);

    await writePartialFilterConfig("/dev/device", {
      gyro: {
        lowpass: {
          hz: 200,
        },
        lowpass2: {
          type: FilterTypes.BIQUAD,
        },
      },
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_SET_FILTER_CONFIG,
      data: [
        200,
        100,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        160,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        200,
        0,
        44,
        1,
        0,
        1,
        200,
        0,
      ],
    });
  });
});
