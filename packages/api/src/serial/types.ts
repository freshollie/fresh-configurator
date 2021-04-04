export enum SerialPortIdentifiers {
  UART1 = 0,
  UART2 = 1,
  UART3 = 2,
  UART4 = 3,
  UART5 = 4,
  UART6 = 5,
  UART7 = 6,
  UART8 = 7,
  UART9 = 8,
  UART10 = 9,
  USB_VCP = 20,
  SOFTSERIAL1 = 30,
  SOFTSERIAL2 = 31,
}

export enum SerialPortFunctions {
  MSP,
  GPS,
  TELEMETRY_FRSKY,
  TELEMETRY_HOTT,
  TELEMETRY_MSP,
  TELEMETRY_LTM,
  TELEMETRY_SMARTPORT,
  RX_SERIAL,
  BLACKBOX,
  TELEMETRY_MAVLINK,
  ESC_SENSOR,
  TBS_SMARTAUDIO,
  TELEMETRY_IBUS,
  IRC_TRAMP,
  RUNCAM_DEVICE_CONTROL,
  LIDAR_TF,
  UNKNOWN,
}

export type PortSettings = {
  id: SerialPortIdentifiers;
  functions: SerialPortFunctions[];
  mspBaudRate: number;
  gpsBaudRate: number;
  telemetryBaudRate: number;
  blackboxBaudRate: number;
};

export type LegacyBaudRates = {
  mspBaudRate: number;
  cliBaudRate: number;
  gpsBaudRate: number;
  gpsPassthroughBaudRate: number;
};

export type SerialConfig = {
  ports: PortSettings[];
  legacy?: LegacyBaudRates;
};
