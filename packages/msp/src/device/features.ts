import semver from "semver";
import { FeatureBits, Features, DisarmFlags, Sensors } from "./types";

const BASE_FEATURE_BITS: FeatureBits = {
  0: Features.RX_PPM,
  2: Features.INFLIGHT_ACC_CAL,
  3: Features.RX_SERIAL,
  4: Features.MOTOR_STOP,
  5: Features.SERVO_TILT,
  6: Features.SOFTSERIAL,
  7: Features.GPS,
  9: Features.SONAR,
  10: Features.TELEMETRY,
  12: Features["3D"],
  13: Features.RX_PARALLEL_PWM,
  14: Features.RX_MSP,
  15: Features.RSSI_ADC,
  16: Features.LED_STRIP,
  17: Features.DISPLAY,
};

// eslint-disable-next-line import/prefer-default-export
export const getFeatureBits = (apiVersion: string): FeatureBits => {
  const featureBits = { ...BASE_FEATURE_BITS };
  if (!semver.gte(apiVersion, "1.33.0")) {
    featureBits[19] = Features.BLACKBOX;
  }

  if (semver.gte(apiVersion, "1.12.0")) {
    featureBits[20] = Features.CHANNEL_FORWARDING;
  }

  if (semver.gte(apiVersion, "1.15.0") && !semver.gte(apiVersion, "1.36.0")) {
    featureBits[8] = Features.FAILSAFE;
  }

  if (semver.gte(apiVersion, "1.16.0")) {
    featureBits[21] = Features.TRANSPONDER;
  }

  if (semver.gte(apiVersion, "1.16.0")) {
    featureBits[22] = Features.AIRMODE;
  }

  if (semver.gte(apiVersion, "1.16.0")) {
    if (semver.lt(apiVersion, "1.20.0")) {
      featureBits[23] = Features.SUPEREXPO_RATES;
    } else if (!semver.gte(apiVersion, "1.33.0")) {
      featureBits[23] = Features.SDCARD;
    }
  }

  if (semver.gte(apiVersion, "1.20.0")) {
    featureBits[18] = Features.OSD;
    if (!semver.gte(apiVersion, "1.35.0")) {
      featureBits[24] = Features.VTX;
    }
  }

  if (semver.gte(apiVersion, "1.31.0")) {
    featureBits[25] = Features.RX_SPI;
    featureBits[27] = Features.ESC_SENSOR;
  }

  if (semver.gte(apiVersion, "1.36.0")) {
    featureBits[28] = Features.ANTI_GRAVITY;
    featureBits[29] = Features.DYNAMIC_FILTER;
  }

  if (!semver.gte(apiVersion, "1.36.0")) {
    featureBits[1] = Features.VBAT;
    featureBits[11] = Features.VCURRENT_METER;
  }

  return featureBits;
};

export const disarmFlagBits = (apiVersion: string): DisarmFlags[] => [
  DisarmFlags.NO_GYRO,
  DisarmFlags.FAILSAFE,
  DisarmFlags.RX_FAILSAFE,
  DisarmFlags.BAD_RX_RECOVERY,
  DisarmFlags.BOXFAILSAFE,
  DisarmFlags.THROTTLE,
  ...(semver.gte(apiVersion, "1.38.0") ? [DisarmFlags.RUNAWAY_TAKEOFF] : []),

  ...(semver.gte(apiVersion, "1.42.0") ? [DisarmFlags.CRASH] : []),
  DisarmFlags.ANGLE,
  DisarmFlags.BOOT_GRACE_TIME,
  DisarmFlags.NOPREARM,
  DisarmFlags.LOAD,
  DisarmFlags.CALIBRATING,
  DisarmFlags.CLI,
  DisarmFlags.CMS_MENU,
  ...(semver.lt(apiVersion, "1.41.0") ? [DisarmFlags.OSD_MENU] : []),
  DisarmFlags.BST,
  DisarmFlags.MSP,
  ...(semver.gte(apiVersion, "1.39.0")
    ? [DisarmFlags.PARALYZE, DisarmFlags.GPS]
    : []),
  ...(semver.gte(apiVersion, "1.41.0")
    ? [DisarmFlags.RESC, DisarmFlags.RPMFILTER]
    : []),
  ...(semver.gte(apiVersion, "1.42.0")
    ? [DisarmFlags.REBOOT_REQD, DisarmFlags.DSHOT_BBANG]
    : []),
  ...(semver.gte(apiVersion, "1.43.0") ? [DisarmFlags.NO_ACC_CAL] : []),
  DisarmFlags.ARM_SWITCH,
];

export const sensorBits = (): Sensors[] => [
  Sensors.ACCELEROMETER,
  Sensors.BAROMETER,
  Sensors.MAGNETOMETER,
  Sensors.GPS,
  Sensors.SONAR,
  Sensors.GYRO,
];
