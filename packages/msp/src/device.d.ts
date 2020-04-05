export interface VoltageMeters {
  id: number;
  voltage: number;
}

export interface AnalogValues {
  voltage: number;
  mahDrawn: number;
  rssi: number;
  amperage: number;
}

export interface RawGpsData {
  fix: number;
  numSat: number;
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  groundCourse: number;
}

export interface BoardInfo {
  boardIdentifier: string;
  boardVersion: number;
  boardType: number;
  targetCapabilities: number;
  targetName: string;
  boardName: string;
  manufacturerId: string;
  signature: number[];
  mcuTypeId: number;
  configurationState: number | undefined;
  sampleRateHz: number | undefined;
}

export type ImuUnit = [number, number, number];

export interface ImuData {
  accelerometer: ImuUnit;
  gyroscope: ImuUnit;
  magnetometer: ImuUnit;
}

export interface Kinematics {
  roll: number;
  pitch: number;
  heading: number;
}

export interface Status {
  cycleTime: number;
  i2cError: number;
  activeSensors: number;
  mode: number;
  profile: number;
}

export interface ExtendedStatus extends Status {
  cpuload: number;
  numProfiles: number;
  rateProfile: number;
  armingDisableCount?: number;
  armingDisableFlags?: number;
}

export interface RcTuning {
  rcRate: number;
  rcExpo: number;
  rollPitchRate: number;
  pitchRate: number;
  rollRate: number;
  yawRate: number;
  dynamicThrottlePid: number;
  throttleMid: number;
  throttleExpo: number;
  dynamicThrottleBreakpoint: number;
  rcYawExpo: number;
  rcYawRate: number;
  rcPitchRate: number;
  rcPitchExpo: number;
  throttleLimitType: number;
  throttleLimitPercent: number;
  rollRateLimit: number;
  pitchRateLimit: number;
  yawRateLimit: number;
}

export interface RcDeadband {
  deadband: number;
  yawDeadband: number;
  altHoldDeadhand: number;
  deadband3dThrottle: number;
}

export enum OSD_VIDEO_TYPES {
  AUTO,
  PAL,
  NTSC
}

export const OSD_VIDEO_VALUE_TO_TYPE = [
  OSD_VIDEO_TYPES.AUTO,
  OSD_VIDEO_TYPES.PAL,
  OSD_VIDEO_TYPES.NTSC
];

export enum OSD_UNIT_TYPES {
  IMPERIAL,
  METRIC
}

export const OSD_UNIT_VALUE_TO_TYPE = [
  OSD_UNIT_TYPES.IMPERIAL,
  OSD_UNIT_TYPES.METRIC
];

export enum OSD_PRECISION_TYPES {
  SECOND,
  HUNDREDTH,
  TENTH
}
export const OSD_PRECISION_VALUE_TO_TYPE = [
  OSD_PRECISION_TYPES.SECOND,
  OSD_PRECISION_TYPES.HUNDREDTH,
  OSD_PRECISION_TYPES.TENTH
];
