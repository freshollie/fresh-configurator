import {
  SerialPortFunctions,
  SerialPortIdentifiers,
  writeSerialConfig,
} from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeSerialPortConfig", () => {
  it("should write the serial config for a v1.43.0 device", async () => {
    mockMsp.setApiVersion("1.43.0");
    await writeSerialConfig("/dev/something", {
      ports: [
        {
          id: SerialPortIdentifiers.UART3,
          functions: [SerialPortFunctions.RX_SERIAL],
          mspBaudRate: 115200,
          gpsBaudRate: 57600,
          telemetryBaudRate: -1,
          blackboxBaudRate: 115200,
        },
      ],
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP2_COMMON_SET_SERIAL_CONFIG,
      data: [1, 2, 64, 0, 0, 0, 5, 4, 0, 5],
    });
  });
});
