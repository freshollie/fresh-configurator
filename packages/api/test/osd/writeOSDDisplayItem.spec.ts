import mockMsp from "../mockMsp";
import { OSDFields, writeOSDDisplayItem } from "../../src";
import codes from "../../src/codes";

describe("writeOSDDisplayItem", () => {
  it("should write the config for the display item in the specified position", async () => {
    mockMsp.setApiVersion("1.42.0");

    await writeOSDDisplayItem("/dev/something", {
      key: OSDFields.DISARMED,
      visibilityProfiles: [true, false, false],
      position: { x: 25, y: 10 },
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [29, 89, 9],
    });
  });

  it("should use the order of items for the specific board version to determine the OSD Field ID", async () => {
    mockMsp.setApiVersion("1.42.0");

    await writeOSDDisplayItem("/dev/something", {
      key: OSDFields.POWER,
      visibilityProfiles: [false, true, false],
      position: { x: 24, y: 20 },
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_SET_OSD_CONFIG,
      data: [19, 152, 18],
    });
  });

  it("should throw an error if the board version doesn't include the specified field", async () => {
    mockMsp.setApiVersion("1.42.0");

    await expect(
      writeOSDDisplayItem("/dev/something", {
        key: OSDFields.ARMED,
        visibilityProfiles: [true, false, false],
        position: { x: 24, y: 20 },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"OSDFields.ARMED does not exist on device"`
    );
  });
});
