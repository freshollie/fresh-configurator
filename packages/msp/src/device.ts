import { times } from "rambda";
import semver from "semver";
import codes from "./serial/codes";
import { execute, apiVersion } from "./serial/connection";
import MspDataView from "./serial/dataview";
import {
  VoltageMeters,
  ImuData,
  ImuUnit,
  Kinematics,
  Status,
  ExtendedStatus,
  RcTuning,
  RcDeadband,
  AnalogValues,
  RawGpsData,
  BoardInfo,
  OSD_LINE_SIZE
} from "./device.d";
import {
  getFeatureBits,
  Features,
  osdFields,
  osdStaticFields,
  OSD_STATIC_FIELDS,
  osdTimers,
  OSD_TIMERS,
  osdWarnings,
  OSD_WARNINGS,
  OSD_FIELDS
} from "./features";
import { bitCheck } from "./serial/utils";

export const readVoltages = async (port: string): Promise<VoltageMeters[]> => {
  const data = await execute(port, { code: codes.MSP_VOLTAGE_METERS });
  return times(
    () => ({
      id: data.readU8(),
      voltage: data.readU8() / 10.0
    }),
    3
  );
};

export const readBoardInfo = async (port: string): Promise<BoardInfo> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_BOARD_INFO });

  return {
    boardIdentifier: String.fromCharCode(...times(() => data.readU8(), 4)),
    boardVersion: data.readU16(),
    boardType: semver.gte(api, "1.35.0") ? data.readU8() : 0,
    targetCapabilities: semver.gte(api, "1.37.0") ? data.readU8() : 0,
    targetName: semver.gte(api, "1.37.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    boardName: semver.gte(api, "1.39.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    manufacturerId: semver.gte(api, "1.39.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    signature: semver.gte(api, "1.39.0") ? times(() => data.readU8(), 32) : [],
    mcuTypeId: semver.gte(api, "1.41.0") ? data.readU8() : 255,
    configurationState: semver.gte(api, "1.42.0") ? data.readU8() : undefined,
    sampleRateHz: semver.gte(api, "1.43.0") ? data.readU16() : undefined
  };
};

export const readAnalogValues = async (port: string): Promise<AnalogValues> => {
  const data = await execute(port, { code: codes.MSP_ANALOG });

  const values = {
    voltage: data.readU8() / 10.0,
    mahDrawn: data.readU16(),
    rssi: data.readU16(), // 0-1023
    amperage: data.read16() / 100 // A
  };

  if (semver.gte(apiVersion(port), "1.41.0")) {
    values.voltage = data.readU16() / 100;
  }

  return values;
};

export const readRawGPS = async (port: string): Promise<RawGpsData> => {
  const data = await execute(port, { code: codes.MSP_RAW_GPS });

  return {
    fix: data.readU8(),
    numSat: data.readU8(),
    lat: data.read32(),
    lon: data.read32(),
    alt: data.readU16(),
    speed: data.readU16(),
    groundCourse: data.readU16()
  };
};

export const readIMUData = async (port: string): Promise<ImuData> => {
  const data = await execute(port, { code: codes.MSP_RAW_IMU });

  const accUnit = (): number => data.read16() / 512;
  const gyroUnit = (): number => data.read16() * (4 / 16.4);
  const mangetUnit = (): number => data.read16() / 1090;

  return {
    accelerometer: times(accUnit, 3) as ImuUnit,
    gyroscope: times(gyroUnit, 3) as ImuUnit,
    magnetometer: times(mangetUnit, 3) as ImuUnit
  };
};

export const readAttitude = async (port: string): Promise<Kinematics> => {
  const data = await execute(port, { code: codes.MSP_ATTITUDE });
  return {
    roll: data.read16() / 10.0, // x
    pitch: data.read16() / 10.0, // y
    heading: data.read16() // z
  };
};

const extractStatus = (data: MspDataView): Status => ({
  cycleTime: data.readU16(),
  i2cError: data.readU16(),
  activeSensors: data.readU16(),
  mode: data.readU32(),
  profile: data.readU8()
});

export const readStatus = async (port: string): Promise<Status> => {
  const data = await execute(port, { code: codes.MSP_STATUS });
  return extractStatus(data);
};

export const readExtendedStatus = async (
  port: string
): Promise<ExtendedStatus> => {
  const data = await execute(port, { code: codes.MSP_STATUS_EX });
  const status: ExtendedStatus = {
    ...extractStatus(data),
    cpuload: data.readU16(),
    numProfiles: data.readU8(),
    rateProfile: data.readU8(),
    armingDisableCount: 0,
    armingDisableFlags: 0
  };

  try {
    const byteCount = data.readU8();
    for (let i = 0; i < byteCount; i += 1) {
      data.readU8();
    }

    // Read arming disable flags
    status.armingDisableCount = data.readU8(); // Flag count
    status.armingDisableFlags = data.readU32();
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return status;
};

export const readFeatures = async (
  port: string
): Promise<{ name: Features; enabled: boolean }[]> => {
  const featureBits = getFeatureBits(apiVersion(port));
  const data = await execute(port, { code: codes.MSP_FEATURE_CONFIG });

  const featureMask = data.readU32();
  return Object.entries(featureBits).map(([bit, name]) => ({
    name,
    // eslint-disable-next-line no-bitwise
    enabled: (featureMask >> parseInt(bit, 10)) % 2 !== 0
  }));
};

export const readRcValues = async (port: string): Promise<number[]> => {
  const data = await execute(port, { code: codes.MSP_RC });
  return new Array(data.byteLength / 2).fill(0).map(() => data.readU16());
};

export const readRcTuning = async (port: string): Promise<RcTuning> => {
  const version = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_RC_TUNING });

  const tuning = {
    rcRate: 0,
    rcExpo: 0,
    rollPitchRate: 0,
    pitchRate: 0,
    rollRate: 0,
    yawRate: 0,
    dynamicThrottlePid: 0,
    throttleMid: 0,
    throttleExpo: 0,
    dynamicThrottleBreakpoint: 0,
    rcYawExpo: 0,
    rcYawRate: 0,
    rcPitchRate: 0,
    rcPitchExpo: 0,
    throttleLimitType: 0,
    throttleLimitPercent: 0,
    rollRateLimit: 0,
    pitchRateLimit: 0,
    yawRateLimit: 0
  };

  tuning.rcRate = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.rcExpo = parseFloat((data.readU8() / 100).toFixed(2));

  if (semver.lt(version, "1.7.0")) {
    tuning.rollPitchRate = parseFloat((data.readU8() / 100).toFixed(2));
  } else {
    tuning.rollRate = parseFloat((data.readU8() / 100).toFixed(2));
    tuning.pitchRate = parseFloat((data.readU8() / 100).toFixed(2));
  }

  tuning.yawRate = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.dynamicThrottlePid = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.throttleMid = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.throttleExpo = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.dynamicThrottleBreakpoint = semver.gte(version, "1.7.0")
    ? data.readU16()
    : 0;

  if (semver.gte(version, "1.10.0")) {
    tuning.rcYawExpo = parseFloat((data.readU8() / 100).toFixed(2));
    if (semver.gte(version, "1.16.0")) {
      tuning.rcYawRate = parseFloat((data.readU8() / 100).toFixed(2));
    }
  }

  if (semver.gte(version, "1.37.0")) {
    tuning.rcPitchRate = parseFloat((data.readU8() / 100).toFixed(2));
    tuning.rcPitchExpo = parseFloat((data.readU8() / 100).toFixed(2));
  }

  if (semver.gte(version, "1.41.0")) {
    tuning.throttleLimitType = data.readU8();
    tuning.throttleLimitPercent = data.readU8();
  }

  if (semver.gte(version, "1.42.0")) {
    tuning.rollRateLimit = data.readU16();
    tuning.pitchRateLimit = data.readU16();
    tuning.yawRateLimit = data.readU16();
  }

  return tuning;
};

const isVisible = (positionData: number, profile: number): boolean =>
  // eslint-disable-next-line no-bitwise
  positionData !== -1 && (positionData & (0x0800 << profile)) !== 0;

const unpackPosition = (positionData: number, api: string): number =>
  // eslint-disable-next-line no-nested-ternary
  semver.gte(api, "1.21.0")
    ? // size * y + x
      // eslint-disable-next-line no-bitwise
      OSD_LINE_SIZE * ((positionData >> 5) & 0x001f) + (positionData & 0x001f)
    : positionData === -1
    ? -1
    : positionData;

export const readRcDeadband = async (port: string): Promise<RcDeadband> => {
  const data = await execute(port, { code: codes.MSP_RC_DEADBAND });

  return {
    deadband: data.readU8(),
    yawDeadband: data.readU8(),
    altHoldDeadhand: data.readU8(),
    deadband3dThrottle: semver.gte(apiVersion(port), "1.17.0")
      ? data.readU16()
      : 0
  };
};

interface OSDConfig {
  displayItems: { key: OSD_FIELDS; position: number; visibility: boolean[] }[];
  staticItems: { key: OSD_STATIC_FIELDS; enabled: boolean }[];
  warnings: { key: OSD_WARNINGS; enabled: boolean }[];
  timers: { key: OSD_TIMERS; enabled: boolean }[];
  osdProfiles: { count: number; selected: number };
  videoSystem: number;
  alarms: {
    rssi: number;
    cap: number;
    time?: number;
    alt: number;
  };
  haveSomeOsd: boolean;
  haveMax7456Video: boolean;
  haveOsdFeatures: boolean;
  isOsdSlave: number;
}

export const readOSDConfig = async (port: string): Promise<any> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_OSD_CONFIG });

  const expectedDisplayItems = osdFields(api);
  let displayItemsCount = expectedDisplayItems.length;

  const config = {
    flags: data.readU8(),
    videoSystem: 0,
    unitMode: 0,
    alarms: {} as any,
    state: {} as any
  };

  if (config.flags > 0) {
    if (data.byteLength > 1) {
      config.videoSystem = data.readU8();
      if (semver.gte(api, "1.21.0") && bitCheck(config.flags, 0)) {
        config.unitMode = data.readU8();
        config.alarms = {
          rssi: data.readU8(),
          cap: data.readU16(),
          time: semver.lt(api, "1.36.0") ? data.readU16() : undefined
        };

        if (semver.gte(api, "1.36.0")) {
          // This value was obsoleted by the introduction of configurable timers, and has been reused to encode the number of display elements sent in this command
          data.readU8();
          const tmp = data.readU8();
          if (semver.gte(api, "1.37.0")) {
            displayItemsCount = tmp;
          }
        }

        config.alarms.alt = data.readU16();
      }
    }
  }

  config.state = {};
  config.state.haveSomeOsd = config.flags !== 0;
  config.state.haveMax7456Video =
    bitCheck(config.flags, 4) ||
    (config.flags === 1 && semver.lt(api, "1.34.0"));
  config.state.isMax7456Detected =
    bitCheck(config.flags, 5) ||
    (config.state.haveMax7456Video && semver.lt(api, "1.43.0"));
  config.state.haveOsdFeature =
    bitCheck(config.flags, 0) ||
    (config.flags === 1 && semver.lt(api, "1.34.0"));
  config.state.isOsdSlave =
    bitCheck(config.flags, 1) && semver.gte(api, "1.34.0");

  config.displayItems = [];
  config.staticItems = [];
  config.warnings = [];
  config.timers = [];

  config.parameters = {};
  config.parameters.overlayRadioMode = 0;
  config.parameters.cameraFrameWidth = 24;
  config.parameters.cameraFrameHeight = 11;

  // Read display element positions, the parsing is done later because we need the number of profiles
  const itemPositions = semver.gte(api, "1.21.0")
    ? times(() => data.readU16(), displayItemsCount)
    : times(() => data.read16(), displayItemsCount);

  const expectedStaticFields = osdStaticFields(api);

  if (semver.gte(api, "1.36.0")) {
    // Parse statistics display enable
    const statsCount = data.readU8();
    if (statsCount !== expectedStaticFields.length) {
      console.error(
        `Firmware is transmitting a different number of statistics (${statsCount}) to what the configurator is expecting (${expectedStaticFields})`
      );
    }
    config.staticItems = times(
      i => ({
        key: expectedStaticFields[i] ?? OSD_STATIC_FIELDS.UNKNOWN,
        enabled: data.readU8() === 1
      }),
      statsCount
    );

    // Parse configurable timers
    const timersCount = data.readU8();
    const expectedTimers = osdTimers(api);
    config.timers = times(i => {
      const timerData = data.readU16();
      return {
        key: expectedTimers[i] ?? OSD_TIMERS.UNKNOWN,
        // eslint-disable-next-line no-bitwise
        src: timerData & 0x0f,
        // eslint-disable-next-line no-bitwise
        precision: (timerData >> 4) & 0x0f,
        // eslint-disable-next-line no-bitwise
        alarm: (timerData >> 8) & 0xff
      };
    }, timersCount);

    // Parse enabled warnings
    const expectedWarnings = osdWarnings(api);
    let warningCount = expectedWarnings.length;
    let warningFlags = data.readU16();

    if (semver.gte(api, "1.41.0")) {
      warningCount = data.readU8();
      // the flags were replaced with a 32bit version
      warningFlags = data.readU32();
    }

    config.warnings = times(
      i => ({
        key: expectedWarnings[i] ?? OSD_WARNINGS.UNKNOWN,
        // eslint-disable-next-line no-bitwise
        enabled: (warningFlags & (1 << i)) !== 0
      }),
      warningCount
    );
  }

  if (semver.gte(api, "1.41.0")) {
    // OSD profiles
    config.osdProfiles.number = data.readU8();
    config.osdProfiles.selected = data.readU8() - 1;

    // Overlay radio mode
    config.parameters.overlayRadioMode = data.readU8();
  } else {
    config.osdProfiles.number = 1;
    config.osdProfiles.selected = 0;
  }

  // Camera frame size
  if (semver.gte(api, "1.43.0")) {
    config.parameters.cameraFrameWidth = data.readU8();
    config.parameters.cameraFrameHeight = data.readU8();
  }

  config.displayItems = itemPositions.map((positionData, i) => ({
    key: expectedDisplayItems[i] ?? OSD_FIELDS.UNKNOWN,
    position: unpackPosition(positionData, api),
    visibility: times(
      profileIndex => isVisible(positionData, profileIndex),
      config.osdProfiles.count
    )
  }));

  return config;
};
