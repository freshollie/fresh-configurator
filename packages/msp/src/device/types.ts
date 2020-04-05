import {
  OSD_TIMER_SOURCES,
  OSD_ALARMS,
  OSD_WARNINGS,
  OSD_FIELDS,
  OSD_STATIC_FIELDS
} from "./features";

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

export enum OSD_UNIT_TYPES {
  IMPERIAL,
  METRIC
}

export enum OSD_PRECISION_TYPES {
  SECOND,
  HUNDREDTH,
  TENTH
}

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

export interface OSDConfig {
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
