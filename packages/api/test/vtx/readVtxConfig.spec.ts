import { readVtxConfig, VtxDeviceTypes } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVtxConfig", () => {
  it("should return the vtx config for a v1.43.0 device", async () => {
    mockMsp.setResponseForCode(
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 8, 5],
      codes.MSP_VTX_CONFIG
    );
    mockMsp.setApiVersion("1.43.0");

    const config = await readVtxConfig("someport");
    expect(config).toEqual({
      type: VtxDeviceTypes.VTXDEV_TRAMP,
      band: 0,
      channel: 0,
      power: 0,
      pitMode: false,
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
  });

  it("should return a vtx config for a v1.41.0 device", async () => {
    mockMsp.setResponseForCode(
      [3, 5, 0, 0, 1, 0, 0, 0, 0],
      codes.MSP_VTX_CONFIG
    );
    mockMsp.setApiVersion("1.41.0");

    const config = await readVtxConfig("someport");
    expect(config).toEqual({
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
        available: false,
        numBands: 0,
        numBandChannels: 0,
        numPowerLevels: 0,
      },
    });
  });
});
