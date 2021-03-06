import { readSdCardSummary, SdCardStates } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readSdCardSummary", () => {
  it("should provide the sd card summary when no card present", async () => {
    mockMsp.setResponse([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(await readSdCardSummary("/dev/someport")).toEqual({
      supported: false,
      state: SdCardStates.NOT_PRESENT,
      filesystemLastError: 0,
      freeSizeKB: 0,
      totalSizeKB: 0,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SDCARD_SUMMARY,
    });
  });

  it("should provide the sd card summary when sd card available", async () => {
    mockMsp.setResponse([1, 0, 0, 0, 0, 0, 10, 0, 5, 0, 20]);
    expect(await readSdCardSummary("/dev/someport")).toEqual({
      supported: true,
      state: SdCardStates.NOT_PRESENT,
      filesystemLastError: 0,
      freeSizeKB: 167772160,
      totalSizeKB: 335545600,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SDCARD_SUMMARY,
    });
  });
});
