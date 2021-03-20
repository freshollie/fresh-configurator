import { readVoltageMeterConfigs } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readVoltageMeterConfigs", () => {
  it("should provide the list of voltage meter configs", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponseForCode(
      [1, 5, 10, 0, 111, 12, 20],
      codes.MSP_VOLTAGE_METER_CONFIG
    );
    const configs = await readVoltageMeterConfigs("/dev/fc");

    expect(configs).toEqual([
      {
        id: 10,
        sensorType: 0,
        vbat: { scale: 111, resDivVal: 12, resDivMultiplier: 20 },
      },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/fc", {
      code: codes.MSP_VOLTAGE_METER_CONFIG,
    });
  });

  it("should throw an error if device should use legacy", async () => {
    mockMsp.setApiVersion("1.35.0");

    await expect(
      readVoltageMeterConfigs("/dev/fc")
    ).rejects.toMatchInlineSnapshot(
      `[Error: Use readLegacyVoltageMeterConfig]`
    );
  });
});
