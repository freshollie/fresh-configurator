import { readDataFlashSummary } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readDataFlashSummary", () => {
  it("should provide the data flash summary", async () => {
    mockMsp.setResponse([3, 128, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0]);
    expect(await readDataFlashSummary("/dev/someport")).toEqual({
      ready: true,
      supported: true,
      sectors: 128,
      totalSize: 8388608,
      usedSize: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_DATAFLASH_SUMMARY,
    });
  });
});
