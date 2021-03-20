import { MeterIndentiers, writeVoltageMeterConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeVoltageMeterConfig", () => {
  it("should provide the list of voltage meter configs", async () => {
    mockMsp.setApiVersion("1.40.0");
    await writeVoltageMeterConfig("/dev/fc", MeterIndentiers.ESC_COMBINED, {
      vbat: { scale: 111, resDivVal: 12, resDivMultiplier: 20 },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/fc", {
      code: codes.MSP_SET_VOLTAGE_METER_CONFIG,
      data: [50, 111, 12, 20],
    });
  });

  it("should throw an error if device should use legacy", async () => {
    mockMsp.setApiVersion("1.35.0");

    await expect(
      writeVoltageMeterConfig("/dev/fc", MeterIndentiers.ESC_MOTOR_1, {
        vbat: { scale: 111, resDivVal: 12, resDivMultiplier: 20 },
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Use writeLegacyVoltageMeterConfig]`
    );
  });
});
