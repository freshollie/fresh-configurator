import mockMsp from "./mockMsp";
import {
  SerialRxProviders,
  SpiRxProtocols,
  writePartialRxConfig,
} from "../src";
import codes from "../src/codes";

describe("writePartialRxConfig", () => {
  it("should merge the initial with the given values and write for 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      9, 108, 7, 220, 5, 220, 5, 0, 117, 3, 67, 8, 0, 19, 40, 5, 0, 0, 0, 0, 0,
      0, 0, 2, 0, 0, 0, 1, 2,
    ]);

    await writePartialRxConfig("/dev/somedevice", {
      spi: {
        protocol: SpiRxProtocols.NRF24_KN,
      },
      serialProvider: SerialRxProviders.TARGET_CUSTOM,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_SET_RX_CONFIG,
      data: [
        11, 108, 7, 220, 5, 220, 5, 0, 117, 3, 67, 8, 0, 19, 40, 5, 12, 0, 0, 0,
        0, 0, 0, 2, 0, 0, 0, 1, 2,
      ],
    });
  });
});
