import mockMsp from "./mockMsp";
import { resetConfig } from "../src";
import codes from "../src/codes";

describe("resetConfig", () => {
  it("should send the reset config command", async () => {
    await resetConfig("/dev/someport");

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_RESET_CONF,
    });
  });
});
