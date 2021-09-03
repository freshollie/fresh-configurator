import { writePartialAdvancedPidConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writePartialAdvancedPidConfig", () => {
  it("should update the advanced pid config with the given parameter for v1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponseForCode(
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 55, 0, 250, 0, 136,
        19, 0, 0, 1, 0, 0, 0, 0, 5, 20, 60, 0, 60, 0, 60, 0, 0,
      ],
      codes.MSP_PID_ADVANCED
    );
    mockMsp.setResponseForCode([], codes.MSP_SET_PID_ADVANCED);

    await writePartialAdvancedPidConfig("/dev/device", {
      acroTrainerAngleLimit: 40,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_SET_PID_ADVANCED,
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 55, 0, 250, 0, 136,
        19, 0, 0, 1, 0, 0, 0, 0, 5, 40, 60, 0, 60, 0, 60, 0, 0,
      ],
    });
  });
});
