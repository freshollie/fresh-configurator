import { VtxDeviceTypes, writeVtxConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeVtxConfig", () => {
  it("should set the vtx config, including table values, for a v1.43.0 device", async () => {
    mockMsp.setApiVersion("1.43.0");
    await writeVtxConfig("/dev/test", {
      type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
      band: 5,
      channel: 0,
      power: 0,
      pitMode: true,
      frequency: 0,
      deviceReady: false,
      lowPowerDisarm: 0,
      pitModeFrequency: 0,
      table: {
        available: true,
        numBands: 5,
        numBandChannels: 8,
        numPowerLevels: 5,
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/test", {
      code: codes.MSP_SET_VTX_CONFIG,
      data: [0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 5, 8, 5, 0],
    });
  });
});
