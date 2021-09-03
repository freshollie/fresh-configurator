import { FilterTypes, readFilterConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readFilterConfig", () => {
  it("should read the filter config from the device for v1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
      44, 1, 0, 0, 200, 0,
    ]);
    const config = await readFilterConfig("/dev/port");
    expect(config).toEqual({
      gyro: {
        hardwareLpf: 0,
        hardwareLpf32khz: 0,
        lowpass: {
          hz: 100,
          dyn: { minHz: 0, maxHz: 0 },
          type: FilterTypes.PT1,
        },
        lowpass2: { hz: 300, type: FilterTypes.PT1 },
        notch: { hz: 0, cutoff: 0 },
        notch2: { hz: 0, cutoff: 0 },
        rpmNotch: { harmonics: 0, minHz: 0 },
      },
      dterm: {
        lowpass: {
          hz: 100,
          dyn: { minHz: 0, maxHz: 0 },
          type: FilterTypes.PT1,
        },
        lowpass2: { hz: 200, type: FilterTypes.PT1 },
        notch: { hz: 0, cutoff: 160 },
      },
      dyn: {
        lpfCurveExpo: 0,
        notch: { range: 0, widthPrecent: 0, q: 0, minHz: 0, maxHz: 0 },
      },
      yaw: { lowpass: { hz: 0 } },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/port", {
      code: codes.MSP_FILTER_CONFIG,
    });
  });
});
