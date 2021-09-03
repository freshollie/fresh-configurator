import mockMsp from "./mockMsp";
import {
  RcInterpolations,
  RcSmoothingDerivativeTypes,
  RcSmoothingInputTypes,
  RcSmoothingTypes,
  SerialRxProviders,
  SpiRxProtocols,
  writeRxConfig,
} from "../src";
import codes from "../src/codes";

describe("writeRxConfig", () => {
  it("should write the rx config for 1.40.0 using the initial config", async () => {
    mockMsp.setApiVersion("1.40.0");

    await writeRxConfig("/dev/somedevice", {
      airModeActivateThreshold: 1320,
      fpvCamAngleDegrees: 0,
      interpolation: RcInterpolations.AUTO,
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
      serialProvider: SerialRxProviders.CRSF,
      spektrumSatBind: 0,
      stick: {
        center: 1500,
        max: 1900,
        min: 1050,
      },
      usbCdcHidType: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_SET_RX_CONFIG,
      data: [
        9, 108, 7, 220, 5, 220, 5, 0, 117, 3, 67, 8, 0, 19, 40, 5, 0, 0, 0, 0,
        0, 0, 0, 2, 0, 0, 0, 1, 2,
      ],
    });
  });
});
