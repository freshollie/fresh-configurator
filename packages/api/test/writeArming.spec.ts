import mockMsp from "./mockMsp";
import { writeArming } from "../src";
import codes from "../src/codes";

describe("writeArming", () => {
  it("should write the given arming states", async () => {
    await writeArming("/dev/something", {
      armingDisabled: true,
      runawayTakeoffPreventionDisabled: true,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ARMING_DISABLE,
      data: [1, 1],
    });
  });

  it("should allow arming state to be enabled", async () => {
    await writeArming("/dev/something", {
      armingDisabled: false,
      runawayTakeoffPreventionDisabled: true,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_ARMING_DISABLE,
      data: [0, 1],
    });
  });
});
