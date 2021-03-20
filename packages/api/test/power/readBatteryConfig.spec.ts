import {
  BatteryCurrentMeterSources,
  BatteryVoltageMeterSources,
  readBatteryConfig,
} from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readBatteryConfig", () => {
  it("should read the battery configuration for v1.40.0 device", async () => {
    mockMsp.setResponse([31, 42, 34, 0, 0, 1, 2]);
    mockMsp.setApiVersion("1.40.0");
    const config = await readBatteryConfig("/dev/somedevice");
    expect(config).toEqual({
      vbat: {
        minCellVoltage: 3.1,
        maxCellVoltage: 4.2,
        warningCellVoltage: 3.4,
      },
      capacity: 0,
      voltageMeterSource: BatteryVoltageMeterSources.ADC,
      currentMeterSource: BatteryCurrentMeterSources.VIRTUAL,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_BATTERY_CONFIG,
    });
  });

  it("should read the battery configuration for v1.41.0 device", async () => {
    mockMsp.setResponse([31, 42, 34, 0, 0, 1, 2, 4, 54, 1, 164, 1, 84, 1]);
    mockMsp.setApiVersion("1.40.0");
    const config = await readBatteryConfig("/dev/somedevice");
    expect(config).toEqual({
      vbat: {
        minCellVoltage: 3.1,
        maxCellVoltage: 4.2,
        warningCellVoltage: 3.4,
      },
      capacity: 0,
      voltageMeterSource: BatteryVoltageMeterSources.ADC,
      currentMeterSource: BatteryCurrentMeterSources.VIRTUAL,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_BATTERY_CONFIG,
    });
  });
});
