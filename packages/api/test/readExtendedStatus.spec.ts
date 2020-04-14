import mockMsp from "./mockMsp";
import { readExtendedStatus } from "../src";
import codes from "../src/codes";

describe("readExtendedStatus", () => {
  it("should correctly read the status and arming flags for api verion 1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      250,
      0,
      0,
      0,
      33,
      0,
      0,
      0,
      0,
      0,
      0,
      40,
      0,
      3,
      0,
      0,
      20,
      132,
      0,
      0,
      0,
    ]);

    const config = await readExtendedStatus("/dev/someport");

    expect(config).toMatchSnapshot();
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_STATUS_EX,
    });
  });
});
