import { times } from "rambda";
import codes from "./codes";
import { execute } from "./serial/connection";
import { MspDataView } from "./serial/utils";
import {
  VoltageMeters,
  ImuData,
  ImuUnit,
  Kinematics,
  MspInfo,
  Status,
  ExtendedStatus
} from "./device.d";

export const getVoltages = async (port: string): Promise<VoltageMeters[]> => {
  const data = await execute(port, { code: codes.MSP_VOLTAGE_METERS });
  return times(
    () => ({
      id: data.readU8(),
      voltage: data.readU8() / 10.0
    }),
    3
  );
};

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

export const getAttitude = async (port: string): Promise<Kinematics> => {
  const data = await execute(port, { code: codes.MSP_ATTITUDE });
  return {
    roll: data.read16() / 10.0, // x
    pitch: data.read16() / 10.0, // y
    heading: data.read16() // z
  };
};

export const getMspInfo = async (port: string): Promise<MspInfo> => {
  const data = await execute(port, { code: codes.MSP_API_VERSION });
  return {
    mspProtocolVersion: data.readU8(),
    apiVersion: `${data.readU8()}.${data.readU8()}.0`
  };
};

const extractStatus = (data: MspDataView): Status => ({
  cycleTime: data.readU16(),
  i2cError: data.readU16(),
  activeSensors: data.readU16(),
  mode: data.readU32(),
  profile: data.readU8()
});

export const getStatus = async (port: string): Promise<Status> => {
  const data = await execute(port, { code: codes.MSP_STATUS });
  return extractStatus(data);
};

export const getStatusExtended = async (
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
