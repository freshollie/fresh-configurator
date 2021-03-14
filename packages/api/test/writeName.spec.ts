import { writeName } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("writeName", () => {
  it("should set the name on the board", async () => {
    await writeName("/dev/device", "superfly");
    expect(mockMsp.execute).toHaveBeenLastCalledWith("/dev/device", {
      code: codes.MSP_SET_NAME,
      data: Buffer.from([115, 117, 112, 101, 114, 102, 108, 121]),
    });
  });
});
