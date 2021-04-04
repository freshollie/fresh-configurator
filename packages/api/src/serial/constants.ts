import { SerialPortFunctions } from "./types";

export const serialPortFunctionBits = (): SerialPortFunctions[] => [
  SerialPortFunctions.MSP,
  SerialPortFunctions.GPS,
  SerialPortFunctions.TELEMETRY_FRSKY,
  SerialPortFunctions.TELEMETRY_HOTT,
  SerialPortFunctions.TELEMETRY_LTM,
  SerialPortFunctions.TELEMETRY_SMARTPORT,
  SerialPortFunctions.RX_SERIAL,
  SerialPortFunctions.BLACKBOX,
  SerialPortFunctions.UNKNOWN,
  SerialPortFunctions.TELEMETRY_MAVLINK,
  SerialPortFunctions.ESC_SENSOR,
  SerialPortFunctions.TBS_SMARTAUDIO,
  SerialPortFunctions.TELEMETRY_IBUS,
  SerialPortFunctions.IRC_TRAMP,
  SerialPortFunctions.RUNCAM_DEVICE_CONTROL,
  SerialPortFunctions.LIDAR_TF,
];

export const legacySerialPortFunctionsMap: Record<
  number,
  SerialPortFunctions[] | undefined
> = {
  1: [SerialPortFunctions.MSP],
  5: [SerialPortFunctions.MSP],
  8: [SerialPortFunctions.MSP],
  2: [SerialPortFunctions.GPS],
  3: [SerialPortFunctions.RX_SERIAL],
  10: [SerialPortFunctions.BLACKBOX],
  11: [SerialPortFunctions.MSP, SerialPortFunctions.BLACKBOX],
};
