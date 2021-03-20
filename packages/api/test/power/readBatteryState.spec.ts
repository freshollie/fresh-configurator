import { readBatteryState } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readBatteryState", () => {
  it("should return the state of the battery for a v1.40.0 device", async () => {
    mockMsp.setResponse([4, 1, 123, 255, 124, 0, 0, 10, 3]);
    mockMsp.setApiVersion("1.40.0");
    const data = await readBatteryState("/dev/device");
    expect(data).toEqual({
      cellCount: 4,
      capacity: 31489,
      voltage: 25.5,
      mAhDrawn: 124,
      amperage: 25.6,
      batteryState: 0,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/device", {
      code: codes.MSP_BATTERY_STATE,
    });
  });
});
