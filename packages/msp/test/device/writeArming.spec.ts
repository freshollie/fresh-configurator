import mockDevice from "./mockDevice";
import { writeArming } from "../../src";
import codes from "../../src/serial/codes";

describe("writeArming", () => {
  it("should write the given arming states", async () => {
    await writeArming("/dev/something", {
      armingDisabled: true,
      runawayTakeoffPreventionDisabled: true,
    });

    expect(mockDevice.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ARMING_DISABLE,
      data: [1, 1],
    });
  });

  it("should allow arming state to be enabled", async () => {
    await writeArming("/dev/something", {
      armingDisabled: false,
      runawayTakeoffPreventionDisabled: true,
    });
    expect(mockDevice.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ARMING_DISABLE,
      data: [0, 1],
    });
  });
});
