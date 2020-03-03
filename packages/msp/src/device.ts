import { times } from "rambda";
import codes from "./codes";
import { execute } from "./serial/connection";

export interface VoltageMeters {
  id: number;
  voltage: number;
}

export const getVoltages = async (port: string): Promise<VoltageMeters[]> => {
  const data = await execute(port, { code: codes.MSP_VOLTAGE_METERS });
  return times(
    () => ({
      id: data.readU8()!,
      voltage: data.readU8()! / 10.0
    }),
    3
  );
};

type ImuUnit = [number, number, number];

export interface ImuData {
  accelerometer: ImuUnit;
  gyroscope: ImuUnit;
  magnetometer: ImuUnit;
}

export const getIMUData = async (port: string): Promise<ImuData> => {
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

export interface Kinematics {
  roll: number;
  pitch: number;
  heading: number;
}

export const getAttitude = async (port: string): Promise<Kinematics> => {
  const data = await execute(port, { code: codes.MSP_ATTITUDE });
  return {
    roll: data.read16() / 10.0, // x
    pitch: data.read16() / 10.0, // y
    heading: data.read16() // z
  };
};

export interface MspInfo {
  mspProtocolVersion: number;
  apiVersion: string;
}

export const getMspInfo = async (port: string): Promise<MspInfo> => {
  const data = await execute(port, { code: codes.MSP_API_VERSION });
  return {
    mspProtocolVersion: data.readU8(),
    apiVersion: `${data.readU8()}.${data.readU8()}.0`
  };
};
