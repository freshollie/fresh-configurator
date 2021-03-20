import {
  BatteryCurrentMeterSources,
  BatteryVoltageMeterSources,
  writeBatteryConfig,
} from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeBatteryConfig", () => {
  it("should set the battery config for a v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    await writeBatteryConfig("/dev/adevice", {
      vbat: {
        minCellVoltage: 3.1,
        maxCellVoltage: 4.2,
        warningCellVoltage: 3.4,
      },
      capacity: 0,
      voltageMeterSource: BatteryVoltageMeterSources.NONE,
      currentMeterSource: BatteryCurrentMeterSources.MSP,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/adevice", {
      code: codes.MSP_SET_BATTERY_CONFIG,
      data: [31, 42, 34, 0, 0, 0, 4],
    });
  });

  it("should use extra data for v1.41.0 device", async () => {
    mockMsp.setApiVersion("1.41.0");
    await writeBatteryConfig("/dev/adevice", {
      vbat: {
        minCellVoltage: 3.1,
        maxCellVoltage: 4.2,
        warningCellVoltage: 3.4,
      },
      capacity: 0,
      voltageMeterSource: BatteryVoltageMeterSources.NONE,
      currentMeterSource: BatteryCurrentMeterSources.MSP,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/adevice", {
      code: codes.MSP_SET_BATTERY_CONFIG,
      data: [31, 42, 34, 0, 0, 0, 4, 54, 1, 164, 1, 84, 1],
    });
  });
});
