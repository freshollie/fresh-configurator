import mockMsp from "./mockMsp";
import { readRCTuning } from "../src";
import codes from "../src/codes";

describe("readRCTuning", () => {
  it("should respond correctly for version 1.42.0", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponse([
      220,
      5,
      220,
      5,
      220,
      5,
      117,
      3,
      220,
      5,
      220,
      5,
      139,
      6,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
      220,
      5,
    ]);

    const tuning = await readRCTuning("/dev/something");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_RC_TUNING,
    });
    expect(tuning).toMatchSnapshot();
  });
});
