import { MeterIndentiers, readVoltageMeters } from "@betaflight/api/src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVoltageMeters", () => {
  it("should return a list of voltage meters", async () => {
    mockMsp.setResponse([10, 50, 50, 40, 60, 30, 61, 20, 62, 10, 63, 0]);
    const meters = await readVoltageMeters("/dev/device");
    expect(meters).toEqual([
      { id: MeterIndentiers.BATTERY, voltage: 5 },
      { id: MeterIndentiers.ESC_COMBINED, voltage: 4 },
      { id: MeterIndentiers.ESC_MOTOR_1, voltage: 3 },
      { id: MeterIndentiers.ESC_MOTOR_2, voltage: 2 },
      { id: MeterIndentiers.ESC_MOTOR_3, voltage: 1 },
      { id: MeterIndentiers.ESC_MOTOR_4, voltage: 0 },
    ]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_VOLTAGE_METERS,
    });
  });
});
