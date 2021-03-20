import { MeterIndentiers, writeCurrentMeterConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeCurrentMeterConfig", () => {
  it("should provide the list of current meter configs", async () => {
    mockMsp.setApiVersion("1.40.0");
    await writeCurrentMeterConfig("/dev/fc", MeterIndentiers.ESC_COMBINED, {
      scale: 45,
      offset: 123,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/fc", {
      code: codes.MSP_SET_CURRENT_METER_CONFIG,
      data: [50, 45, 0, 123, 0],
    });
  });

  it("should throw an error if device should use legacy", async () => {
    mockMsp.setApiVersion("1.35.0");

    await expect(
      writeCurrentMeterConfig("/dev/fc", MeterIndentiers.ESC_MOTOR_1, {
        scale: 45,
        offset: 123,
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Use writeLegacyCurrentMeterConfig]`
    );
  });
});
