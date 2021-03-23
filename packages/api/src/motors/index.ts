import { apiVersion, execute, WriteBuffer } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { partialWriteFunc } from "../utils";
import { MixerConfig, MotorConfig } from "./types";

export type { MixerConfig, MotorConfig } from "./types";

export const readMotorConfig = async (port: string): Promise<MotorConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_MOTOR_CONFIG });

  return {
    minThrottle: data.readU16(), // 0-2000
    maxThrottle: data.readU16(), // 0-2000
    minCommand: data.readU16(), // 0-2000
    ...(semver.gte(api, "1.42.0")
      ? {
          motorCount: data.readU8(),
          motorPoles: data.readU8(),
          useDshotTelemetry: data.readU8() !== 0,
          useEscSensor: data.readU8() !== 0,
        }
      : {
          motorCount: 0,
          motorPoles: 0,
          useDshotTelemetry: false,
          useEscSensor: false,
        }),
  };
};

export const writeMotorConfig = async (
  port: string,
  config: MotorConfig
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();
  buffer
    .push16(config.minThrottle)
    .push16(config.maxThrottle)
    .push16(config.minCommand);
  if (semver.gte(api, "1.42.0")) {
    buffer.push8(config.motorPoles);
    buffer.push8(config.useDshotTelemetry ? 1 : 0);
  }

  await execute(port, { code: codes.MSP_SET_MOTOR_CONFIG, data: buffer });
};

export const readMixerConfig = async (port: string): Promise<MixerConfig> => {
  const data = await execute(port, { code: codes.MSP_MIXER_CONFIG });
  const api = apiVersion(port);
  return {
    mixer: data.readU8(),
    reversedMotors: !!(semver.gte(api, "1.36.0") ? data.readU8() : 0),
  };
};

export const writeMixerConfig = async (
  port: string,
  config: MixerConfig
): Promise<void> => {
  const buffer = new WriteBuffer();
  const api = apiVersion(port);

  buffer.push8(config.mixer);
  if (semver.gte(api, "1.36.0")) {
    buffer.push8(config.reversedMotors ? 1 : 0);
  }
  await execute(port, { code: codes.MSP_SET_MIXER_CONFIG, data: buffer });
};

export const writePartialMixerConfig = partialWriteFunc(
  readMixerConfig,
  writeMixerConfig
);
