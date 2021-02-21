import mockMsp from "./mockMsp";
import { readRxMap } from "../src";
import codes from "../src/codes";

describe("readRxMap", () => {
  it("should read the channel map from the board", async () => {
    mockMsp.setResponse([0, 1, 3, 2, 4, 5, 6, 7]);
    expect(await readRxMap("/dev/someport")).toEqual([
      "A",
      "E",
      "T",
      "R",
      "1",
      "2",
      "3",
      "4",
    ]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_RX_MAP,
    });

    mockMsp.setResponse([1, 2, 3, 0, 4, 5, 6, 7]);
    expect(await readRxMap("/dev/someport")).toEqual([
      "T",
      "A",
      "E",
      "R",
      "1",
      "2",
      "3",
      "4",
    ]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_RX_MAP,
    });
  });
});
