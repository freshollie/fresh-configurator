import mockMsp from "../mockMsp";
import readOsdData from "./osdConfigData";
import { readOSDConfig } from "../../src";
import codes from "../../src/codes";

describe("readOSDConfig", () => {
  it("should read a 1.42.0 config correctly", async () => {
    mockMsp.setResponse(readOsdData);
    mockMsp.setApiVersion("1.42.0");

    const config = await readOSDConfig("/dev/something");
    expect(config).toMatchSnapshot();
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_OSD_CONFIG,
    });
  });
});
