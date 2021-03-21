import { MeterIndentiers, readCurrentMeters } from "@betaflight/api/src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readCurrentMeters", () => {
  it("should read the state of the current meters", async () => {
    mockMsp.setResponse([
      10,
      0,
      0,
      0,
      0,
      80,
      0,
      0,
      0,
      0,
      50,
      0,
      0,
      0,
      0,
      60,
      0,
      0,
      0,
      0,
      61,
      0,
      0,
      0,
      0,
      62,
      0,
      0,
      0,
      0,
      63,
      0,
      0,
      0,
      0,
      64,
      0,
      0,
      0,
      0,
    ]);
    const meters = await readCurrentMeters("/dev/port");
    expect(meters).toEqual([
      { id: MeterIndentiers.BATTERY, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.CELL_1, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_COMBINED, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_MOTOR_1, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_MOTOR_2, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_MOTOR_3, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_MOTOR_4, mAhDrawn: 0, amperage: 0 },
      { id: MeterIndentiers.ESC_MOTOR_5, mAhDrawn: 0, amperage: 0 },
    ]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/port", {
      code: codes.MSP_CURRENT_METERS,
    });
  });
});
