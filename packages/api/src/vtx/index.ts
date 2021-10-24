import { apiVersion, execute, WriteBuffer } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { partialWriteFunc, times } from "../utils";
import {
  VtxBaseDeviceStatus,
  VtxConfig,
  VtxDeviceTypes,
  VtxRtc6705DeviceStatus,
  VtxSmartAudioDeviceStatus,
  VtxTableBandsRow,
  VtxTablePowerLevelsRow,
  VtxTrampDeviceStatus,
  VtxUnknownDeviceStatus,
  VtxUnsupportedDeviceStatus,
} from "./types";

export type {
  VtxBaseDeviceStatus,
  VtxConfig,
  VtxDeviceTypes,
  VtxRtc6705DeviceStatus,
  VtxSmartAudioDeviceStatus,
  VtxTableBandsRow,
  VtxTablePowerLevelsRow,
  VtxTrampDeviceStatus,
  VtxUnknownDeviceStatus,
  VtxUnsupportedDeviceStatus,
};

export const readVtxConfig = async (port: string): Promise<VtxConfig> => {
  const api = apiVersion(port);

  const data = await execute(port, { code: codes.MSP_VTX_CONFIG });

  return {
    type: data.readU8(),
    band: data.readU8(),
    channel: data.readU8(),
    power: data.readU8(),
    pitMode: data.readU8() !== 0,
    frequency: data.readU16(),
    deviceReady: data.readU8() !== 0,
    lowPowerDisarm: data.readU8(),
    ...(semver.gte(api, "1.42.0")
      ? {
          pitModeFrequency: data.readU16(),
          table: {
            available: data.readU8() !== 0,
            numBands: data.readU8(),
            numChannels: data.readU8(),
            numPowerLevels: data.readU8(),
          },
        }
      : {
          pitModeFrequency: 0,
          table: {
            available: false,
            numBands: 0,
            numChannels: 0,
            numPowerLevels: 0,
          },
        }),
  };
};

export const writeVtxConfig = async (
  port: string,
  config: VtxConfig,
  clearVtxTable = false
): Promise<void> => {
  const buffer = new WriteBuffer();
  const api = apiVersion(port);

  buffer
    .push16(config.frequency)
    .push8(config.power)
    .push8(config.pitMode ? 1 : 0)
    .push8(config.lowPowerDisarm);

  if (semver.gte(api, "1.42.0")) {
    buffer
      .push16(config.pitModeFrequency)
      .push8(config.band)
      .push8(config.channel)
      .push16(config.frequency)
      .push8(config.table.numBands)
      .push8(config.table.numChannels)
      .push8(config.table.numPowerLevels)
      .push8(clearVtxTable ? 1 : 0);
  }
};

export const clearVtxTable = async (port: string): Promise<void> => {
  const config = await readVtxConfig(port);
  await writeVtxConfig(port, config, true);
};

export const writePartialVtxConfig = partialWriteFunc(
  readVtxConfig,
  writeVtxConfig
);

/**
 * Read the VTX table row, row number indexes from 1
 */
export const readVtxTablePowerLevelsRow = async (
  port: string,
  rowNumber: number
): Promise<VtxTablePowerLevelsRow> => {
  const buffer = new WriteBuffer();
  buffer.push8(rowNumber);
  const data = await execute(port, {
    code: codes.MSP_VTXTABLE_POWERLEVEL,
    data: buffer,
  });

  return {
    rowNumber: data.readU8(),
    value: data.readU16(),
    label: String.fromCharCode(...times(() => data.readU8(), data.readU8())),
  };
};

export const writeVtxTablePowerLevelsRow = async (
  port: string,
  row: VtxTablePowerLevelsRow
): Promise<void> => {
  const buffer = new WriteBuffer();

  buffer.push8(row.rowNumber).push16(row.value);

  buffer.push8(row.label.length);
  buffer.push(...Buffer.from(row.label));

  await execute(port, {
    code: codes.MSP_SET_VTXTABLE_POWERLEVEL,
    data: buffer,
  });
};

/**
 * Read the VTX table row, row number indexes from 1
 */
export const readVtxTableBandsRow = async (
  port: string,
  rowNumber: number
): Promise<VtxTableBandsRow> => {
  const buffer = new WriteBuffer();
  buffer.push8(rowNumber);
  const data = await execute(port, {
    code: codes.MSP_VTXTABLE_BAND,
    data: buffer,
  });

  return {
    rowNumber: data.readU8(),
    name: String.fromCharCode(...times(() => data.readU8(), data.readU8())),
    letter: String.fromCharCode(data.readU8()),
    isFactoryBand: data.readU8() !== 0,
    frequencies: times(() => data.readU16(), data.readU8()),
  };
};

export const writeVtxTableBandsRow = async (
  port: string,
  row: VtxTableBandsRow
): Promise<void> => {
  const buffer = new WriteBuffer();
  buffer.push8(row.rowNumber);
  buffer.push8(row.name.length);
  buffer.push(...Buffer.from(row.name));

  if (row.letter !== "") {
    buffer.push8(row.letter.charCodeAt(0));
  } else {
    buffer.push8(" ".charCodeAt(0));
  }

  buffer.push8(row.isFactoryBand ? 1 : 0);

  buffer.push8(row.frequencies.length);
  row.frequencies.forEach((frequency) => {
    buffer.push16(frequency);
  });

  await execute(port, { code: codes.MSP_SET_VTXTABLE_BAND, data: buffer });
};

export const readVtxDeviceStatus = async (
  port: string
): Promise<
  | VtxSmartAudioDeviceStatus
  | VtxTrampDeviceStatus
  | VtxRtc6705DeviceStatus
  | VtxUnknownDeviceStatus
  | VtxUnsupportedDeviceStatus
> => {
  const data = await execute(port, { code: codes.MSP2_GET_VTX_DEVICE_STATUS });

  const vtxType: VtxDeviceTypes = data.readU8();

  const deviceIsReady = Boolean(data.readU8());

  const isBandAndChannelAvailable = Boolean(data.readU8());
  const band = data.readU8();
  const channel = data.readU8();

  const powerIndexAvailable = Boolean(data.readU8());
  const powerIndex = data.readU8();

  const frequencyAvailable = Boolean(data.readU8());
  const frequency = data.readU16();

  const vtxStatusAvailable = Boolean(data.readU8());
  const vtxStatus = data.readU32(); // pitmode and/or locked

  const powerLevelCount = data.readU8();
  const powersAndLevels = times(
    () => [data.readU16(), data.readU16()] as const,
    powerLevelCount
  );

  const baseConfig: VtxBaseDeviceStatus = {
    deviceIsReady,
    band: isBandAndChannelAvailable ? band : undefined,
    channel: isBandAndChannelAvailable ? channel : undefined,
    powerIndex: powerIndexAvailable ? powerIndex : undefined,
    frequency: frequencyAvailable ? frequency : undefined,
    vtxStatus: vtxStatusAvailable ? vtxStatus : undefined,
    levels: powersAndLevels.map((value) => value[0]),
    powers: powersAndLevels.map((value) => value[1]),
  };

  switch (vtxType) {
    case VtxDeviceTypes.VTXDEV_SMARTAUDIO:
      data.readU8(); // custom device status size
      return {
        type: vtxType,
        version: data.readU8(),
        mode: data.readU8(),
        orfreq: data.readU8(),
        willBootIntoPitMode: Boolean(data.readU8()),
        ...baseConfig,
      };
    case VtxDeviceTypes.VTXDEV_RTC6705:
    case VtxDeviceTypes.VTXDEV_TRAMP:
    case VtxDeviceTypes.VTXDEV_UNKNOWN:
    default:
      data.readU8();
      return {
        type: vtxType,
        ...baseConfig,
      };
  }
};
