import { apiVersion, execute, WriteBuffer } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { packValues, times, unpackValues } from "../utils";
import {
  legacySerialPortFunctionsMap,
  serialPortFunctionBits,
} from "./constants";
import {
  SerialConfig,
  SerialPortIdentifiers,
  SerialPortFunctions,
} from "./types";

export { SerialConfig, SerialPortIdentifiers, SerialPortFunctions };

export const BAUD_RATES = [
  -1,
  9600,
  19200,
  38400,
  57600,
  115200,
  230400,
  250000,
  400000,
  460800,
  500000,
  921600,
  1000000,
  1500000,
  2000000,
  2470000,
];

const toBaudRate = (baudRateIdentifier: number): number =>
  BAUD_RATES[baudRateIdentifier] ?? -1;

export const readSerialConfig = async (port: string): Promise<SerialConfig> => {
  const api = apiVersion(port);

  if (semver.gte(api, "1.43.0")) {
    const data = await execute(port, {
      code: codes.MSP2_COMMON_SERIAL_CONFIG,
    });
    const count = data.readU8();
    const portConfigSize = data.remaining() / count;
    return {
      ports: times(() => {
        const start = data.remaining();
        const serialPort = {
          id: data.readU8() as SerialPortIdentifiers,
          functions: unpackValues(data.readU32(), serialPortFunctionBits()),
          mspBaudRate: toBaudRate(data.readU8()),
          gpsBaudRate: toBaudRate(data.readU8()),
          telemetryBaudRate: toBaudRate(data.readU8()),
          blackboxBaudRate: toBaudRate(data.readU8()),
        };

        while (
          start - data.remaining() < portConfigSize &&
          data.remaining() > 0
        ) {
          data.readU8();
        }

        return serialPort;
      }, count),
    };
  }
  const data = await execute(port, {
    code: codes.MSP_CF_SERIAL_CONFIG,
  });

  if (semver.lt(api, "1.6.0")) {
    const serialPortCount = (data.byteLength - 16) / 2;

    return {
      ports: times(
        () => ({
          id: data.readU8() as SerialPortIdentifiers,
          functions: legacySerialPortFunctionsMap[data.readU8()] ?? [],
          mspBaudRate: -1,
          gpsBaudRate: -1,
          telemetryBaudRate: -1,
          blackboxBaudRate: -1,
        }),
        serialPortCount
      ),
      legacy: {
        mspBaudRate: data.readU32(),
        cliBaudRate: data.readU32(),
        gpsBaudRate: data.readU32(),
        gpsPassthroughBaudRate: data.readU32(),
      },
    };
  }
  const serialPortCount = Math.floor(data.byteLength / (1 + 2 + 1 * 4));
  return {
    ports: times(
      () => ({
        id: data.readU8() as SerialPortIdentifiers,
        functions: unpackValues(data.readU16(), serialPortFunctionBits()),
        mspBaudRate: toBaudRate(data.readU8()),
        gpsBaudRate: toBaudRate(data.readU8()),
        telemetryBaudRate: toBaudRate(data.readU8()),
        blackboxBaudRate: toBaudRate(data.readU8()),
      }),
      serialPortCount
    ),
  };
};

export const writeSerialConfig = async (
  port: string,
  config: SerialConfig
): Promise<void> => {
  const buffer = new WriteBuffer();

  const api = apiVersion(port);

  if (semver.gte(api, "1.43.0")) {
    buffer.push8(config.ports.length);

    config.ports.forEach((portSettings) => {
      buffer.push8(portSettings.id);

      buffer
        .push32(packValues(portSettings.functions, serialPortFunctionBits()))
        .push8(BAUD_RATES.indexOf(portSettings.mspBaudRate))
        .push8(BAUD_RATES.indexOf(portSettings.gpsBaudRate))
        .push8(BAUD_RATES.indexOf(portSettings.telemetryBaudRate))
        .push8(BAUD_RATES.indexOf(portSettings.blackboxBaudRate));
    });
    await execute(port, {
      code: codes.MSP2_COMMON_SET_SERIAL_CONFIG,
      data: buffer,
    });
  } else {
    if (semver.lt(api, "1.6.0")) {
      // for (let i = 0; i < SERIAL_CONFIG.ports.length; i++) {
      //   buffer.push8(SERIAL_CONFIG.ports[i].scenario);
      // }
      // buffer
      //   .push32(SERIAL_CONFIG.mspBaudRate)
      //   .push32(SERIAL_CONFIG.cliBaudRate)
      //   .push32(SERIAL_CONFIG.gpsBaudRate)
      //   .push32(SERIAL_CONFIG.gpsPassthroughBaudRate);
    } else {
      config.ports.forEach((portSettings) => {
        buffer.push8(portSettings.id);

        buffer
          .push16(packValues(portSettings.functions, serialPortFunctionBits()))
          .push8(BAUD_RATES.indexOf(portSettings.mspBaudRate))
          .push8(BAUD_RATES.indexOf(portSettings.gpsBaudRate))
          .push8(BAUD_RATES.indexOf(portSettings.telemetryBaudRate))
          .push8(BAUD_RATES.indexOf(portSettings.blackboxBaudRate));
      });
    }
    await execute(port, {
      code: codes.MSP_SET_CF_SERIAL_CONFIG,
      data: buffer,
    });
  }
};
