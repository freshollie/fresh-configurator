import { readFcVariant } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readFcVariant", () => {
  it("should return the name of the fc variant", async () => {
    mockMsp.setResponseForCode([66, 84, 70, 76], codes.MSP_FC_VARIANT);
    const variant = await readFcVariant("/dev/someport");
    expect(variant).toEqual("BTFL");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_FC_VARIANT,
    });
  });
});
