import { apiVersion, execute, WriteBuffer } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { times } from "../utils";
import {
  BatteryConfig,
  BatteryState,
  CurrentMeterConfig,
  CurrentMeters,
  LegacyCurrentMeterConfig,
  LegacyVoltageMeterConfig,
  MeterIndentiers,
  VoltageMeterConfig,
  VoltageMeters,
  BatteryCurrentMeterSources,
  BatteryVoltageMeterSources,
} from "./types";

export type {
  BatteryConfig,
  BatteryState,
  CurrentMeterConfig,
  CurrentMeters,
  LegacyCurrentMeterConfig,
  LegacyVoltageMeterConfig,
  VoltageMeterConfig,
  VoltageMeters,
};

export {
  MeterIndentiers,
  BatteryCurrentMeterSources,
  BatteryVoltageMeterSources,
};

export const readVoltageMeters = async (
  port: string
): Promise<VoltageMeters[]> => {
  const data = await execute(port, { code: codes.MSP_VOLTAGE_METERS });
  return times(
    () => ({
      id: data.readU8(),
      voltage: data.readU8() / 10.0,
    }),
    data.byteLength / 2
  );
};

export const readCurrentMeters = async (
  port: string
): Promise<CurrentMeters[]> => {
  const data = await execute(port, { code: codes.MSP_CURRENT_METERS });
  return times(
    () => ({
      id: data.readU8(),
      mAhDrawn: data.readU16(), // mAh
      amperage: data.readU16() / 1000, // A
    }),
    data.byteLength / 5
  );
};

export const readLegacyVoltageMeterConfig = async (
  port: string
): Promise<LegacyVoltageMeterConfig> => {
  const api = apiVersion(port);
  if (semver.gte(api, "1.36.0")) {
    throw new Error("Not a legacy device");
  }

  const data = await execute(port, { code: codes.MSP_VOLTAGE_METER_CONFIG });

  return {
    vbat: {
      scale: data.readU8(), // 10-200
      minCellVoltage: data.readU8() / 10, // 10-50
      maxCellVoltage: data.readU8() / 10, // 10-50
      warningCellVoltage: data.readU8() / 10, // 10-50
    },
    meterType: semver.gte(api, "1.23.0") ? data.readU8() : 0,
  };
};

export const writeLegacyVoltageMeterConfig = async (
  port: string,
  config: LegacyVoltageMeterConfig
): Promise<void> => {
  const api = apiVersion(port);
  if (semver.gte(api, "1.36.0")) {
    throw new Error("Not a legacy device");
  }
  const buffer = new WriteBuffer();
  buffer
    .push8(config.vbat.scale)
    .push8(Math.round(config.vbat.minCellVoltage * 10))
    .push8(Math.round(config.vbat.maxCellVoltage * 10))
    .push8(Math.round(config.vbat.warningCellVoltage * 10));
  if (semver.gte(api, "1.23.0")) {
    buffer.push8(config.meterType);
  }

  await execute(port, {
    code: codes.MSP_SET_VOLTAGE_METER_CONFIG,
    data: buffer,
  });
};

export const readVoltageMeterConfigs = async (
  port: string
): Promise<VoltageMeterConfig[]> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use readLegacyVoltageMeterConfig");
  }

  const data = await execute(port, { code: codes.MSP_VOLTAGE_METER_CONFIG });

  return times(() => {
    const subframeLength = data.readU8();
    if (subframeLength !== 5) {
      // discard this config because it's the wrong length
      times(() => data.readU8(), subframeLength);
      return undefined;
    }
    return {
      id: data.readU8(),
      sensorType: data.readU8(),
      vbat: {
        scale: data.readU8(),
        resDivVal: data.readU8(),
        resDivMultiplier: data.readU8(),
      },
    };
  }, data.readU8()).filter(Boolean) as VoltageMeterConfig[];
};

export const writeVoltageMeterConfig = async (
  port: string,
  id: MeterIndentiers,
  config: Omit<VoltageMeterConfig, "id" | "sensorType">
): Promise<void> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use writeLegacyVoltageMeterConfig");
  }

  const buffer = new WriteBuffer();
  buffer
    .push8(id)
    .push8(config.vbat.scale)
    .push8(config.vbat.resDivVal)
    .push8(config.vbat.resDivMultiplier);

  await execute(port, {
    code: codes.MSP_SET_VOLTAGE_METER_CONFIG,
    data: buffer,
  });
};

export const readLegacyCurrentMeterConfig = async (
  port: string
): Promise<LegacyCurrentMeterConfig> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use readCurrentMeterConfigs");
  }

  const data = await execute(port, { code: codes.MSP_CURRENT_METER_CONFIG });
  return {
    scale: data.read16(),
    offset: data.read16(),
    meterType: data.readU8(),
    batteryCapacity: data.readU16(),
  };
};

export const writeLegacyCurrentMeterConfig = async (
  port: string,
  config: LegacyCurrentMeterConfig
): Promise<void> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use readCurrentMeterConfigs");
  }
  const buffer = new WriteBuffer();
  buffer
    .push16(config.scale)
    .push16(config.offset)
    .push8(config.meterType)
    .push16(config.batteryCapacity);
  await execute(port, {
    code: codes.MSP_SET_CURRENT_METER_CONFIG,
    data: buffer,
  });
};

export const readCurrentMeterConfigs = async (
  port: string
): Promise<CurrentMeterConfig[]> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use readLegacyCurrentMeterConfig");
  }

  const data = await execute(port, { code: codes.MSP_CURRENT_METER_CONFIG });

  return times(() => {
    const subframeLength = data.readU8();
    if (subframeLength !== 6) {
      // discard this config because it's the wrong length
      times(() => data.readU8(), subframeLength);
      return undefined;
    }
    return {
      id: data.readU8(),
      sensorType: data.readU8(),
      scale: data.read16(),
      offset: data.read16(),
    };
  }, data.readU8()).filter(Boolean) as CurrentMeterConfig[];
};

export const writeCurrentMeterConfig = async (
  port: string,
  id: MeterIndentiers,
  config: Omit<CurrentMeterConfig, "id" | "sensorType">
): Promise<void> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.36.0")) {
    throw new Error("Use writeLegacyCurrentMeterConfig");
  }

  const buffer = new WriteBuffer();
  buffer.push8(id).push16(config.scale).push16(config.offset);

  await execute(port, {
    code: codes.MSP_SET_CURRENT_METER_CONFIG,
    data: buffer,
  });
};

export const readBatteryState = async (port: string): Promise<BatteryState> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_BATTERY_STATE });

  return {
    cellCount: data.readU8(),
    capacity: data.readU16(), // mAh

    // @ts-expect-error typescript is erroring here
    // but this shouldn't be a problem
    voltage: data.readU8() / 10, // V
    mAhDrawn: data.readU16(), // mAh
    amperage: data.readU16() / 100, // A

    ...(semver.gte(api, "1.41.0")
      ? {
          batteryState: data.readU8(),
          voltage: data.readU16() / 100,
        }
      : { batteryState: 0 }),
  };
};

export const readBatteryConfig = async (
  port: string
): Promise<BatteryConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_BATTERY_CONFIG });

  const config = {
    vbat: {
      minCellVoltage: data.readU8() / 10, // 10-50
      maxCellVoltage: data.readU8() / 10, // 10-50
      warningCellVoltage: data.readU8() / 10, // 10-50
    },
    capacity: data.readU16(),
    voltageMeterSource: data.readU8(),
    currentMeterSource: data.readU8(),
  };
  if (semver.gte(api, "1.41.0")) {
    config.vbat.minCellVoltage = data.readU16() / 100;
    config.vbat.maxCellVoltage = data.readU16() / 100;
    config.vbat.warningCellVoltage = data.readU16() / 100;
  }

  return config;
};

export const writeBatteryConfig = async (
  port: string,
  config: BatteryConfig
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();

  buffer
    .push8(Math.round(config.vbat.minCellVoltage * 10))
    .push8(Math.round(config.vbat.maxCellVoltage * 10))
    .push8(Math.round(config.vbat.warningCellVoltage * 10))
    .push16(config.capacity)
    .push8(config.voltageMeterSource)
    .push8(config.currentMeterSource);
  if (semver.gte(api, "1.41.0")) {
    buffer
      .push16(Math.round(config.vbat.minCellVoltage * 100))
      .push16(Math.round(config.vbat.maxCellVoltage * 100))
      .push16(Math.round(config.vbat.warningCellVoltage * 100));
  }

  await execute(port, { code: codes.MSP_SET_BATTERY_CONFIG, data: buffer });
};
