import { readBoxIds } from "../src";
import mockMsp from "./mockMsp";

describe("readBoxIds", () => {
  it("should return the available mode ids for the current configuration", async () => {
    mockMsp.setResponse([
      0, 1, 2, 6, 27, 4, 7, 13, 19, 26, 28, 30, 31, 32, 33, 34, 35, 36, 39, 45,
      47,
    ]);
    const boxIds = await readBoxIds("/dev/something");

    expect(boxIds).toEqual([
      0, 1, 2, 6, 27, 4, 7, 13, 19, 26, 28, 30, 31, 32, 33, 34, 35, 36, 39, 45,
      47,
    ]);
  });
});
