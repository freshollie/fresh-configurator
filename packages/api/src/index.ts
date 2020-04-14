import { times } from "rambda";
import semver from "semver";
import { MspDataView, execute, apiVersion, WriteBuffer } from "@betaflight/msp";
import codes from "./codes";

import {
  VoltageMeters,
  ImuData,
  ImuUnit,
  Kinematics,
  Status,
  ExtendedStatus,
  RCTuning,
  RCDeadband,
  AnalogValues,
  RawGpsData,
  BoardInfo,
  DisarmFlags,
  Sensors,
  Feature,
} from "./types";
import { getFeatureBits, disarmFlagBits, sensorBits } from "./features";

export * from "./osd";

export { Features, DisarmFlags, Sensors } from "./types";
export {
  apiVersion,
  open,
  close,
  isOpen,
  bytesRead,
  bytesWritten,
  packetErrors,
  ports,
} from "@betaflight/msp";

export const readVoltages = async (port: string): Promise<VoltageMeters[]> => {
  const data = await execute(port, { code: codes.MSP_VOLTAGE_METERS });
  return times(
    () => ({
      id: data.readU8(),
      voltage: data.readU8() / 10.0,
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
    sampleRateHz: semver.gte(api, "1.43.0") ? data.readU16() : undefined,
  };
};

export const readAnalogValues = async (port: string): Promise<AnalogValues> => {
  const data = await execute(port, { code: codes.MSP_ANALOG });

  const values = {
    voltage: data.readU8() / 10.0,
    mahDrawn: data.readU16(),
    rssi: data.readU16(), // 0-1023
    amperage: data.read16() / 100, // A
  };

  if (semver.gte(apiVersion(port), "1.41.0")) {
    values.voltage = data.readU16() / 100;
  }

  return values;
};

export const readRawGPS = async (port: string): Promise<RawGpsData> => {
  const data = await execute(port, { code: codes.MSP_RAW_GPS });

  return {
    fix: !!data.readU8(),
    numSat: data.readU8(),
    lat: data.read32(),
    lon: data.read32(),
    alt: data.readU16(),
    speed: data.readU16(),
    groundCourse: data.readU16(),
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
    magnetometer: times(mangetUnit, 3) as ImuUnit,
  };
};

export const readAttitude = async (port: string): Promise<Kinematics> => {
  const data = await execute(port, { code: codes.MSP_ATTITUDE });
  return {
    roll: data.read16() / 10.0, // x
    pitch: data.read16() / 10.0, // y
    heading: data.read16(), // z
  };
};

const activeSensors = (sensorFlags: number): Sensors[] =>
  sensorBits().filter((_, i) => (sensorFlags >> i) % 2 !== 0);

const extractStatus = (data: MspDataView): Status => ({
  cycleTime: data.readU16(),
  i2cError: data.readU16(),
  sensors: activeSensors(data.readU16()),
  mode: data.readU32(),
  profile: data.readU8(),
});

export const readStatus = async (port: string): Promise<Status> => {
  const data = await execute(port, { code: codes.MSP_STATUS });
  return extractStatus(data);
};

export const readExtendedStatus = async (
  port: string
): Promise<ExtendedStatus> => {
  const data = await execute(port, { code: codes.MSP_STATUS_EX });
  const api = apiVersion(port);
  const status: ExtendedStatus = {
    ...extractStatus(data),
    cpuload: data.readU16(),
    numProfiles: 0,
    rateProfile: 0,
    armingDisabledFlags: [],
  };

  if (semver.gte(api, "1.16.0")) {
    status.numProfiles = data.readU8();
    status.rateProfile = data.readU8();
  }

  if (semver.gte(api, "1.36.0")) {
    // skip all this data for some reason
    times(() => data.readU8(), data.readU8());

    const flags = disarmFlagBits(api);
    // Read arming disable flags
    const numFlags = data.readU8();
    const flagBits = data.readU32();

    // read the enabled disarm flags from the mask
    status.armingDisabledFlags = times(
      (i) => (flagBits & (1 << i)) !== 0 && (flags[i] ?? DisarmFlags.UNKNOWN),
      numFlags
    ).filter((flag): flag is DisarmFlags => typeof flag === "number");
  }
  return status;
};

export const readFeatures = async (port: string): Promise<Feature[]> => {
  const featureBits = getFeatureBits(apiVersion(port));
  const data = await execute(port, { code: codes.MSP_FEATURE_CONFIG });

  const featureMask = data.readU32();
  return Object.entries(featureBits).map(([bit, key]) => ({
    key,
    enabled: (featureMask >> parseInt(bit, 10)) % 2 !== 0,
  }));
};

export const readRcValues = async (port: string): Promise<number[]> => {
  const data = await execute(port, { code: codes.MSP_RC });
  return new Array(data.byteLength / 2).fill(0).map(() => data.readU16());
};

export const readRCTuning = async (port: string): Promise<RCTuning> => {
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
    yawRateLimit: 0,
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

export const readRCDeadband = async (port: string): Promise<RCDeadband> => {
  const data = await execute(port, { code: codes.MSP_RC_DEADBAND });

  return {
    deadband: data.readU8(),
    yawDeadband: data.readU8(),
    altHoldDeadhand: data.readU8(),
    deadband3dThrottle: semver.gte(apiVersion(port), "1.17.0")
      ? data.readU16()
      : 0,
  };
};

export const writeArming = async (
  port: string,
  {
    armingDisabled,
    runawayTakeoffPreventionDisabled,
  }: { armingDisabled: boolean; runawayTakeoffPreventionDisabled: boolean }
): Promise<void> => {
  const data = new WriteBuffer();
  data.push8(Number(armingDisabled));
  data.push8(Number(runawayTakeoffPreventionDisabled));

  await execute(port, { code: codes.MSP_ARMING_DISABLE, data });
};

export const calibrateAccelerometer = async (port: string): Promise<void> => {
  await execute(port, { code: codes.MSP_ACC_CALIBRATION });
  // This command executes on the device, but doesn't actually produce anything
  // for about 2 seconds, so resolve after 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
};
