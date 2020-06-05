import mockMsp from "./mockMsp";
import { readUID } from "../src";
import codes from "../src/codes";

describe("readUID", () => {
  it("should read the UID from the board as hex format", async () => {
    mockMsp.setResponse([44, 0, 62, 0, 12, 87, 52, 87, 52, 54, 48, 32]);

    expect(await readUID("/dev/someport")).toEqual("3e002c34570c303634");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_UID,
    });

    mockMsp.setResponse([44, 0, 62, 0, 12, 87, 52, 87, 50, 54, 48, 32]);
    expect(await readUID("/dev/someotherport")).toEqual("3e002c34570c303632");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someotherport", {
      code: codes.MSP_UID,
    });
  });
});
