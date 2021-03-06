import { eraseDataFlash } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("eraseDataFlash", () => {
  it("should execute the erase data flash command", async () => {
    await eraseDataFlash("/dev/somedevice");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_DATAFLASH_ERASE,
    });
  });
});
