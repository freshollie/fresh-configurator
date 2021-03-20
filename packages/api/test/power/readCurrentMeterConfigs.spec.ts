import { MeterIndentiers, readCurrentMeterConfigs } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVoltageMeterConfigs", () => {
  it("should provide the list of voltage meter configs", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([2, 6, 10, 1, 45, 0, 123, 0, 6, 80, 0, 0, 0, 0, 0]);
    const configs = await readCurrentMeterConfigs("/dev/fc");

    expect(configs).toEqual([
      { id: MeterIndentiers.BATTERY, sensorType: 1, scale: 45, offset: 123 },
      { id: MeterIndentiers.CELL_1, sensorType: 0, scale: 0, offset: 0 },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/fc", {
      code: codes.MSP_CURRENT_METER_CONFIG,
    });
  });

  it("should throw an error if device should use legacy", async () => {
    mockMsp.setApiVersion("1.35.0");

    await expect(
      readCurrentMeterConfigs("/dev/fc")
    ).rejects.toMatchInlineSnapshot(
      `[Error: Use readLegacyCurrentMeterConfig]`
    );
  });
});
