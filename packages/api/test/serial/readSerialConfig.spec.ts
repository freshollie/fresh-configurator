import mockMsp from "../mockMsp";
import {
  readSerialConfig,
  SerialPortFunctions,
  SerialPortIdentifiers,
} from "../../src";
import codes from "../../src/codes";

describe("readSerialConfig", () => {
  it("should respond correctly for version 1.42.0", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponse([
      0, 1, 0, 5, 4, 0, 5, 1, 0, 32, 5, 4, 0, 5, 2, 64, 0, 5, 4, 0, 5,
    ]);

    const config = await readSerialConfig("/dev/someport");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_CF_SERIAL_CONFIG,
    });
    expect(config.ports).toEqual([
      {
        blackboxBaudRate: 115200,
        functions: [SerialPortFunctions.MSP],
        gpsBaudRate: 57600,
        id: SerialPortIdentifiers.UART1,
        mspBaudRate: 115200,
        telemetryBaudRate: -1,
      },
      {
        blackboxBaudRate: 115200,
        functions: [SerialPortFunctions.IRC_TRAMP],
        gpsBaudRate: 57600,
        id: SerialPortIdentifiers.UART2,
        mspBaudRate: 115200,
        telemetryBaudRate: -1,
      },
      {
        blackboxBaudRate: 115200,
        functions: [SerialPortFunctions.RX_SERIAL],
        gpsBaudRate: 57600,
        id: SerialPortIdentifiers.UART3,
        mspBaudRate: 115200,
        telemetryBaudRate: -1,
      },
    ]);
  });

  it("should return the serial config for a v1.43.0 device", async () => {
    mockMsp.setApiVersion("1.43.0");
    mockMsp.setResponse([
      5, 20, 1, 0, 0, 0, 5, 4, 0, 5, 0, 0, 0, 0, 0, 5, 4, 0, 5, 2, 0, 0, 0, 0,
      5, 4, 0, 5, 3, 1, 0, 0, 0, 5, 4, 0, 5, 5, 64, 0, 0, 0, 5, 4, 0, 5,
    ]);

    const config = await readSerialConfig("/dev/device");
    expect(config.ports).toEqual([
      {
        id: SerialPortIdentifiers.USB_VCP,
        functions: [SerialPortFunctions.MSP],
        mspBaudRate: 115200,
        gpsBaudRate: 57600,
        telemetryBaudRate: -1,
        blackboxBaudRate: 115200,
      },
      {
        id: SerialPortIdentifiers.UART1,
        functions: [],
        mspBaudRate: 115200,
        gpsBaudRate: 57600,
        telemetryBaudRate: -1,
        blackboxBaudRate: 115200,
      },
      {
        id: SerialPortIdentifiers.UART3,
        functions: [],
        mspBaudRate: 115200,
        gpsBaudRate: 57600,
        telemetryBaudRate: -1,
        blackboxBaudRate: 115200,
      },
      {
        id: SerialPortIdentifiers.UART4,
        functions: [SerialPortFunctions.MSP],
        mspBaudRate: 115200,
        gpsBaudRate: 57600,
        telemetryBaudRate: -1,
        blackboxBaudRate: 115200,
      },
      {
        id: SerialPortIdentifiers.UART6,
        functions: [SerialPortFunctions.RX_SERIAL],
        mspBaudRate: 115200,
        gpsBaudRate: 57600,
        telemetryBaudRate: -1,
        blackboxBaudRate: 115200,
      },
    ]);
  });
});
