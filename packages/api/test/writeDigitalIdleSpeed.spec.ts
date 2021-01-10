import mockMsp from "./mockMsp";
import { writeDigitalIdleSpeed } from "../src";
import codes from "../src/codes";

describe("writeDigitalIdleSpeed", () => {
  it("should write the digital idle percentage for a v1.31.0 device", async () => {
    mockMsp.setApiVersion("1.31.0");
    // Respond to `readAdvancedPidConfig`
    mockMsp.setResponse([
      3,
      2,
      0,
      1,
      224,
      1,
      194,
      1,
      0,
      0,
      0,
      0,
      48,
      125,
      0,
      0,
      0,
      2,
    ]);

    await writeDigitalIdleSpeed("/dev/someport", 10);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_ADVANCED_CONFIG,
      data: [3, 2, 0, 1, 224, 1, 232, 3, 0],
    });
  });
});
