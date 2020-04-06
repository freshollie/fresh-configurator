import semver from "semver";

export enum Features {
  RX_PPM,
  INFLIGHT_ACC_CAL,
  RX_SERIAL,
  MOTOR_STOP,
  SERVO_TILT,
  SOFTSERIAL,
  GPS,
  SONAR,
  TELEMETRY,
  "3D",
  RX_PARALLEL_PWM,
  RX_MSP,
  RSSI_ADC,
  LED_STRIP,
  DISPLAY,
  BLACKBOX,
  CHANNEL_FORWARDING,
  FAILSAFE,
  TRANSPONDER,
  AIRMODE,
  SUPEREXPO_RATES,
  SDCARD,
  OSD,
  VTX,
  RX_SPI,
  ESC_SENSOR,
  ANTI_GRAVITY,
  DYNAMIC_FILTER,
  VBAT,
  VCURRENT_METER,
}

type FeatureBits = Record<number, Features>;

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
