import mockDevice from "../mockDevice";
import readOsdData from "./readOSDConfig.json";
import { readOSDConfig } from "../../../src";
import codes from "../../../src/serial/codes";

describe("readOSDConfig", () => {
  it("should read a 1.42.0 config correctly", async () => {
    mockDevice.setResponse(readOsdData);
    mockDevice.setApiVersion("1.42.0");

    const config = await readOSDConfig("/dev/something");
    expect(config).toMatchSnapshot();
    expect(mockDevice.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_OSD_CONFIG,
    });
  });
});
