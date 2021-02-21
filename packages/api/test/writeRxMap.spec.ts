import mockMsp from "./mockMsp";
import { writeRxMap } from "../src";
import codes from "../src/codes";

describe("writeRxMap", () => {
  it("should write the provided rx map as values", async () => {
    await writeRxMap("/dev/someport", ["T", "A", "E", "R", "1", "2", "3", "4"]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_RX_MAP,
      data: [1, 2, 3, 0, 4, 5, 6, 7],
    });

    await writeRxMap("/dev/someport", ["A", "E", "R", "T", "1", "2", "3", "4"]);
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_RX_MAP,
      data: [0, 1, 2, 3, 4, 5, 6, 7],
    });
  });
});
