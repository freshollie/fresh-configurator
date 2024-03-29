import mockMsp from "../mockMsp";
import { Modes, readModeRangeSlots } from "../../src";
import codes from "../../src/codes";

beforeEach(() => {
  mockMsp.resetResponses();
});

describe("readModeRangeSlots", () => {
  it("should return the mode range slots without extra information for v1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      0, 3, 16, 32, 0, 3, 16, 34, 0, 5, 2, 18, 0, 0, 16, 32, 0, 0, 16, 32, 0, 0,
      16, 32, 0, 0, 16, 32, 0, 0, 16, 32, 0, 0, 16, 32, 0, 0, 16, 32, 1, 0, 16,
      32, 1, 0, 16, 32, 1, 255, 16, 32, 1, 255, 16, 32, 1, 255, 16, 32, 2, 0,
      16, 32, 2, 255, 16, 32, 2, 255, 16, 32, 2, 255, 16, 32, 6, 0, 16, 32,
    ]);

    expect(await readModeRangeSlots("/dev/someport")).toEqual([
      { modeId: 0, auxChannel: 3, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 3, range: { start: 1300, end: 1750 } },
      { modeId: 0, auxChannel: 5, range: { start: 950, end: 1350 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 1, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 1, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 1, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 1, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 1, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 2, auxChannel: 0, range: { start: 1300, end: 1700 } },
      { modeId: 2, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 2, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 2, auxChannel: 255, range: { start: 1300, end: 1700 } },
      { modeId: 6, auxChannel: 0, range: { start: 1300, end: 1700 } },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_MODE_RANGES,
    });
  });

  it("should handle reading extra information for v1.41.0+ devices", async () => {
    mockMsp.setApiVersion("1.41.0");
    mockMsp.setResponseForCode(
      [
        0, 0, 32, 48, 2, 2, 32, 48, 13, 1, 32, 48, 35, 1, 32, 48, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      codes.MSP_MODE_RANGES
    );

    mockMsp.setResponseForCode(
      [
        20, 0, 0, 0, 2, 0, 0, 13, 0, 0, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      codes.MSP_MODE_RANGES_EXTRA
    );

    expect(await readModeRangeSlots("/dev/someport")).toEqual([
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 1700, end: 2100 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: Modes.HORIZON,
        auxChannel: 2,
        range: { start: 1700, end: 2100 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: Modes.BEEPER_ON,
        auxChannel: 1,
        range: { start: 1700, end: 2100 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: Modes.FLIP_OVER_AFTER_CRASH,
        auxChannel: 1,
        range: { start: 1700, end: 2100 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
      {
        modeId: 0,
        auxChannel: 0,
        range: { start: 900, end: 900 },
        modeLogic: 0,
        linkedTo: 0,
      },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_MODE_RANGES,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_MODE_RANGES_EXTRA,
    });
  });
});
