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
  OSD_VIDEO_TYPES,
  OSD_UNIT_TYPES,
  OSD_PRECISION_TYPES,
  OSD_VIDEO_VALUE_TO_TYPE,
  OSD_UNIT_VALUE_TO_TYPE,
  OSD_PRECISION_VALUE_TO_TYPE
} from "./device.d";
import {
  getFeatureBits,
  Features,
  osdFields,
  osdStaticFields,
  OSD_STATIC_FIELDS,
  osdTimerSources,
  OSD_TIMER_SOURCES,
  osdWarnings,
  OSD_WARNINGS,
  OSD_FIELDS,
  OSD_ALARMS
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

const unpackPosition = (positionData: number): [number, number] =>
  positionData === -1
    ? [0, 0]
    : // eslint-disable-next-line no-bitwise
      [positionData & 0x001f, (positionData >> 5) & 0x001f];

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

interface OSDProfileConfig {
  count: number;
  selected: number;
}

interface OSDTimer {
  src: OSD_TIMER_SOURCES;
  precision: OSD_PRECISION_TYPES;
  time: number;
}

interface OSDAlarm {
  key: OSD_ALARMS;
  value: number;
}

interface OSDWarning {
  key: OSD_WARNINGS;
  enabled: boolean;
}

interface OSDDisplayItem {
  key: OSD_FIELDS;
  position: [number, number];
  visibility: boolean[];
}

interface OSDStaticItem {
  key: OSD_STATIC_FIELDS;
  enabled: boolean;
}

interface OSDFlags {
  hasOSD: boolean;
  haveMax7456Video: boolean;
  haveOsdFeature: boolean;
  isOsdSlave: boolean;
}

interface OSDConfig {
  flags: OSDFlags;
  unitMode: OSD_UNIT_TYPES;
  displayItems: OSDDisplayItem[];
  staticItems: OSDStaticItem[];
  warnings: OSDWarning[];
  timers: OSDTimer[];
  timerSources: OSD_TIMER_SOURCES[];
  osdProfiles: OSDProfileConfig;
  videoSystem: OSD_VIDEO_TYPES;
  alarms: OSDAlarm[];
  parameters: {
    cameraFrameWidth: number;
    cameraFrameHeight: number;
    overlayRadioMode: number;
  };
}

export const readOSDConfig = async (port: string): Promise<OSDConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_OSD_CONFIG });

  const expectedDisplayItems = osdFields(api);

  const flagsData = data.readU8();
  const hasOSD = flagsData !== 0;
  const flag0Active = bitCheck(flagsData, 0);

  const videoSystem = hasOSD
    ? OSD_VIDEO_VALUE_TO_TYPE[data.readU8()]
    : OSD_VIDEO_TYPES.AUTO;
  const unitMode =
    hasOSD && semver.gte(api, "1.21.0") && flag0Active
      ? OSD_UNIT_VALUE_TO_TYPE[data.readU8()]
      : OSD_UNIT_TYPES.IMPERIAL;

  const alarms =
    hasOSD && semver.gte(api, "1.21.0") && flag0Active
      ? [
          { key: OSD_ALARMS.RSSI, value: data.readU8() },
          { key: OSD_ALARMS.CAP, value: data.readU16() }
        ]
      : [];

  let displayItemsCount = expectedDisplayItems.length;

  if (hasOSD && semver.gte(api, "1.36.0") && flag0Active) {
    // This value was obsoleted by the introduction of configurable timers, and has been reused to encode the number of display elements sent in this command
    data.readU8();
    const tmp = data.readU8();
    if (semver.gte(api, "1.37.0")) {
      displayItemsCount = tmp;
    }
  } else {
    alarms.push({ key: OSD_ALARMS.TIME, value: data.readU16() });
  }

  if (hasOSD && semver.gte(api, "1.36.0") && flag0Active) {
    alarms.push({ key: OSD_ALARMS.ALT, value: data.readU16() });
  }

  const haveMax7456Video =
    bitCheck(flagsData, 4) || (flagsData === 1 && semver.lt(api, "1.34.0"));

  const flags = {
    hasOSD,
    haveMax7456Video,
    isMax7456Detected:
      bitCheck(flagsData, 5) || (haveMax7456Video && semver.lt(api, "1.43.0")),
    haveOsdFeature:
      bitCheck(flagsData, 0) || (flagsData === 1 && semver.lt(api, "1.34.0")),
    isOsdSlave: bitCheck(flagsData, 1) && semver.gte(api, "1.34.0")
  };

  // Read display element positions, the parsing is done later because we need the number of profiles
  const itemPositions = semver.gte(api, "1.21.0")
    ? times(() => data.readU16(), displayItemsCount)
    : times(() => data.read16(), displayItemsCount);

  const expectedStaticFields = osdStaticFields(api);
  const staticItems = semver.gte(api, "1.36.0")
    ? times(
        i => ({
          key: expectedStaticFields[i] ?? OSD_STATIC_FIELDS.UNKNOWN,
          enabled: data.readU8() === 1
        }),
        data.readU8()
      )
    : [];

  // Parse configurable timers
  const timersCount = data.readU8();
  const timerSources = osdTimerSources(api);
  const timers = semver.gte(api, "1.36.0")
    ? times(() => {
        const timerData = data.readU16();
        return {
          // eslint-disable-next-line no-bitwise
          src: timerSources[timerData & 0x0f] ?? OSD_TIMER_SOURCES.UNKNOWN,
          // eslint-disable-next-line no-bitwise
          precision: OSD_PRECISION_VALUE_TO_TYPE[(timerData >> 4) & 0x0f],
          // eslint-disable-next-line no-bitwise
          time: (timerData >> 8) & 0xff
        };
      }, timersCount)
    : [];

  // Parse warning
  const expectedWarnings = osdWarnings(api);
  let warningCount = expectedWarnings.length;
  let warningFlags = data.readU16();
  if (semver.gte(api, "1.41.0")) {
    warningCount = data.readU8();
    // the flags were replaced with a 32bit version
    warningFlags = data.readU32();
  }
  const warnings = semver.gte(api, "1.36.0")
    ? times(
        i => ({
          key: expectedWarnings[i] ?? OSD_WARNINGS.UNKNOWN,
          // eslint-disable-next-line no-bitwise
          enabled: (warningFlags & (1 << i)) !== 0
        }),
        warningCount
      )
    : [];

  const osdProfiles = semver.gte(api, "1.41.0")
    ? {
        count: data.readU8(),
        selected: data.readU8() - 1
      }
    : {
        count: 1,
        selected: 0
      };

  const parameters = {
    overlayRadioMode: semver.gte(api, "1.41.0") ? data.readU8() : 0,
    cameraFrameWidth: semver.gte(api, "1.43.0") ? data.readU8() : 24,
    cameraFrameHeight: semver.gte(api, "1.43.0") ? data.readU8() : 11
  };

  const displayItems = itemPositions.map((positionData, i) => ({
    key: expectedDisplayItems[i] ?? OSD_FIELDS.UNKNOWN,
    position: unpackPosition(positionData),
    visibility: times(
      profileIndex => isVisible(positionData, profileIndex),
      osdProfiles.count
    )
  }));

  return {
    flags,
    staticItems,
    displayItems,
    alarms,
    timerSources,
    warnings,
    timers,
    videoSystem,
    osdProfiles,
    parameters,
    unitMode
  };
};
