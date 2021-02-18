import {
  RcInterpolations,
  RcSmoothingDerivativeTypes,
  RcSmoothingInputTypes,
  RcSmoothingTypes,
  readRxConfig,
  SerialRxProviders,
  SpiRxProtocols,
} from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readRxConfig", () => {
  it("should respond correctly for version 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      0,
      108,
      7,
      220,
      5,
      26,
      4,
      0,
      117,
      3,
      67,
      8,
      2,
      19,
      40,
      5,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      1,
      2,
      0,
    ]);

    const config = await readRxConfig("/dev/someport");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_RX_CONFIG,
    });
    expect(config).toEqual({
      airModeActivateThreshold: 1320,
      fpvCamAngleDegrees: 0,
      interpolation: RcInterpolations.MANUAL,
      interpolationInterval: 19,
      rcSmoothing: {
        autoSmoothness: 0,
        channels: 2,
        derivativeCutoff: 0,
        derivativeType: RcSmoothingDerivativeTypes.BIQUAD,
        inputCutoff: 0,
        inputType: RcSmoothingInputTypes.BIQUAD,
        type: RcSmoothingTypes.INTERPOLATION,
      },
      rxMaxUsec: 2115,
      rxMinUsec: 885,
      spi: {
        id: 0,
        protocol: SpiRxProtocols.NRF24_V202_250K,
        rfChannelCount: 0,
      },
      serialProvider: SerialRxProviders.SPEKTRUM1024,
      spektrumSatBind: 0,
      stick: {
        center: 1500,
        max: 1900,
        min: 1050,
      },
      usbCdcHidType: 0,
    });
  });
});
