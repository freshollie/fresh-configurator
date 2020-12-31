import mockMsp from "./mockMsp";
import { writeMotorDirection } from "../src";
import codes from "../src/codes";

describe("writeMotorDirection", () => {
  it("should use the existing mixer config to write the motor direction as reversed for a v1.38.0 device", async () => {
    mockMsp.setApiVersion("1.38.0");
    mockMsp.setResponse([3, 0]);

    await writeMotorDirection("/dev/someport", true);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [3, 1],
    });
  });

  it("should use the existing mixer config to write the motor direction as normal for a v1.38.0 device", async () => {
    mockMsp.setApiVersion("1.38.0");
    mockMsp.setResponse([10, 1]);

    await writeMotorDirection("/dev/someport", false);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_MIXER_CONFIG,
      data: [10, 0],
    });
  });
});
