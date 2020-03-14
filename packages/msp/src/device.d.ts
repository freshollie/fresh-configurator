export interface VoltageMeters {
  id: number;
  voltage: number;
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

export interface MspInfo {
  mspProtocolVersion: number;
  apiVersion: string;
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
