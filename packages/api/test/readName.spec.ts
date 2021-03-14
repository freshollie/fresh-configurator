import { readName } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readName", () => {
  it("should read the name from the device", async () => {
    mockMsp.setResponseForCode(
      [102, 114, 101, 115, 104, 112, 118],
      codes.MSP_NAME
    );
    const name = await readName("/dev/port");

    expect(name).toBe("freshpv");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/port", {
      code: codes.MSP_NAME,
    });
  });
});
