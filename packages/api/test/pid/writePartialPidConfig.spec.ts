import { writePartialPidConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writePartialPidConfig", () => {
  it("should merge the provided config with the existing config and write to the board", async () => {
    mockMsp.setResponseForCode(
      [46, 45, 25, 50, 50, 27, 65, 45, 0, 50, 50, 75, 40, 0, 0],
      codes.MSP_PID
    );
    mockMsp.setResponseForCode([], codes.MSP_SET_PID);

    await writePartialPidConfig("/dev/bardwell", {
      mag: { i: 50 },
      yaw: { p: 1, d: 15 },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/bardwell", {
      code: codes.MSP_SET_PID,
      data: [46, 45, 25, 50, 50, 27, 1, 45, 15, 50, 50, 75, 40, 50, 0],
    });
  });
});
