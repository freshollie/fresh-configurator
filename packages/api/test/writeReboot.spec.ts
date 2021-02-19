import mockMsp from "./mockMsp";
import { reboot, RebootTypes } from "../src";
import codes from "../src/codes";

describe("reboot", () => {
  it("should return true if the reboot request was successful for 1.40.0", async () => {
    mockMsp.setResponse([44, 0, 62, 0, 12, 87, 52, 87, 52, 54, 48, 32]);
    mockMsp.setApiVersion("1.40.0");

    expect(await reboot("/dev/somedevice")).toBeTruthy();
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_SET_REBOOT,
      data: undefined,
      timeout: 3000,
    });
  });

  it("should allow a type of reboot to be given", async () => {
    mockMsp.setResponse([44, 0, 62, 0, 12, 87, 52, 87, 52, 54, 48, 32]);
    mockMsp.setApiVersion("1.40.0");

    expect(
      await reboot("/dev/somedevice", RebootTypes.BOOTLOADER)
    ).toBeTruthy();
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/somedevice", {
      code: codes.MSP_SET_REBOOT,
      data: [RebootTypes.BOOTLOADER],
      timeout: 3000,
    });
  });
});
