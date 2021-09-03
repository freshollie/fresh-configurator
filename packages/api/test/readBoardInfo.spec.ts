import mockMsp from "./mockMsp";
import { readBoardInfo } from "../src";
import codes from "../src/codes";

describe("readBoardInfo", () => {
  it("should correctly read board info for v1.40.0", async () => {
    mockMsp.setResponse([
      83, 82, 70, 51, 0, 0, 0, 2, 10, 83, 80, 82, 65, 67, 73, 78, 71, 70, 51,
    ]);

    mockMsp.setApiVersion("1.40.0");

    const boardInfo = await readBoardInfo("/dev/someport");

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_BOARD_INFO,
    });
    expect(boardInfo).toMatchSnapshot();
  });

  it("should correctly read board info for v1.42.0", async () => {
    mockMsp.setResponse([
      83, 52, 49, 49, 0, 0, 2, 55, 9, 83, 84, 77, 51, 50, 70, 52, 49, 49, 12,
      67, 82, 65, 90, 89, 66, 69, 69, 70, 52, 70, 83, 4, 72, 65, 77, 79, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 4, 2,
    ]);

    mockMsp.setApiVersion("v1.42.0");

    expect(await readBoardInfo("/dev/something")).toMatchSnapshot();
  });
});
