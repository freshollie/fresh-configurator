import mockMsp from "./mockMsp";
import { Beepers, writeBeeperConfig } from "../src";
import codes from "../src/codes";

describe("writeBeeperConfig", () => {
  it("should write the beeper config for api version 1.39.0", async () => {
    mockMsp.setApiVersion("1.39.0");

    await writeBeeperConfig("/dev/someport", {
      conditions: [
        Beepers.CAM_CONNECTION_CLOSE,
        Beepers.DISARMING,
        Beepers.READY_BEEP,
        Beepers.GYRO_CALIBRATED,
        Beepers.RX_SET,
      ],
      dshot: {
        tone: 4,
        conditions: [Beepers.RX_LOST],
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_BEEPER_CONFIG,
      data: [246, 237, 95, 0, 4, 253, 255, 127, 0],
    });
  });

  it("should not write dshot conditions for api version <= 1.39.0", async () => {
    mockMsp.setApiVersion("1.37.0");

    await writeBeeperConfig("/dev/someport", {
      conditions: [
        Beepers.CAM_CONNECTION_CLOSE,
        Beepers.DISARMING,
        Beepers.READY_BEEP,
        Beepers.GYRO_CALIBRATED,
        Beepers.RX_SET,
      ],
      dshot: {
        tone: 4,
        // Expect the GYRO_CALIBRATED not to be set in the conditions
        conditions: [Beepers.RX_LOST, Beepers.GYRO_CALIBRATED] as any,
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_BEEPER_CONFIG,
      data: [246, 237, 31, 0, 4],
    });
  });

  it("should not write dshot tone for api version <= 1.37.0", async () => {
    mockMsp.setApiVersion("1.34.0");

    await writeBeeperConfig("/dev/someport", {
      conditions: [
        Beepers.CAM_CONNECTION_CLOSE,
        Beepers.DISARMING,
        Beepers.READY_BEEP,
        Beepers.GYRO_CALIBRATED,
        Beepers.RX_SET,
      ],
      dshot: {
        tone: 4,
        conditions: [Beepers.RX_LOST, Beepers.RX_SET],
      },
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_BEEPER_CONFIG,
      data: [246, 237, 7, 0],
    });
  });
});
