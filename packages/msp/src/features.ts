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
  VCURRENT_METER
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
  17: Features.DISPLAY
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

export enum OSD_FIELDS {
  RSSI_VALUE,
  MAIN_BATT_VOLTAGE,
  CROSSHAIRS,
  ARTIFICIAL_HORIZON,
  HORIZON_SIDEBARS,
  TIMER,
  THROTTLE_POSITION,
  CPU_LOAD,
  VTX_CHANNEL,
  VOLTAGE_WARNING,
  ARMED,
  DISARMED,
  CURRENT_DRAW,
  MAH_DRAWN,
  CRAFT_NAME,
  ALTITUDE,
  FLYTIME,
  ONTIME,
  TIMER_1,
  TIMER_2,
  FLYMODE,
  GPS_SPEED,
  GPS_SATS,
  PID_ROLL,
  PID_PITCH,
  PID_YAW,
  POWER,
  PID_RATE_PROFILE,
  WARNINGS,
  BATTERY_WARNING,
  AVG_CELL_VOLTAGE,
  GPS_LON,
  GPS_LAT,
  DEBUG,
  PITCH_ANGLE,
  ROLL_ANGLE,
  MAIN_BATT_USAGE,
  HOME_DIR,
  HOME_DIST,
  NUMERICAL_HEADING,
  NUMERICAL_VARIO,
  COMPASS_BAR,
  ESC_TEMPERATURE,
  ESC_RPM,
  REMAINING_TIME_ESTIMATE,
  RTC_DATE_TIME,
  ADJUSTMENT_RANGE,
  CORE_TEMPERATURE,
  ANTI_GRAVITY,
  G_FORCE,
  MOTOR_DIAG,
  LOG_STATUS,
  FLIP_ARROW,
  LINK_QUALITY,
  FLIGHT_DIST,
  STICK_OVERLAY_LEFT,
  STICK_OVERLAY_RIGHT,
  DISPLAY_NAME,
  ESC_RPM_FREQ,
  RATE_PROFILE_NAME,
  PID_PROFILE_NAME,
  OSD_PROFILE_NAME,
  RSSI_DBM_VALUE,
  RC_CHANNELS,
  CAMERA_FRAME,
  UNKNOWN
}

/**
 * Return the OSD fields in their data read order
 * based on the given api version
 */
export const osdFields = (apiVersion: string): OSD_FIELDS[] => {
  // version 3.0.1
  if (semver.gte(apiVersion, "1.21.0")) {
    return [
      OSD_FIELDS.RSSI_VALUE,
      OSD_FIELDS.MAIN_BATT_VOLTAGE,
      OSD_FIELDS.CROSSHAIRS,
      OSD_FIELDS.ARTIFICIAL_HORIZON,
      OSD_FIELDS.HORIZON_SIDEBARS,
      ...(semver.lt(apiVersion, "1.36.0")
        ? [OSD_FIELDS.ONTIME, OSD_FIELDS.FLYTIME]
        : [OSD_FIELDS.TIMER_1, OSD_FIELDS.TIMER_2]),
      OSD_FIELDS.FLYMODE,
      OSD_FIELDS.CRAFT_NAME,
      OSD_FIELDS.THROTTLE_POSITION,
      OSD_FIELDS.VTX_CHANNEL,
      OSD_FIELDS.CURRENT_DRAW,
      OSD_FIELDS.MAH_DRAWN,
      OSD_FIELDS.GPS_SPEED,
      OSD_FIELDS.GPS_SATS,
      OSD_FIELDS.ALTITUDE,
      ...(semver.gte(apiVersion, "1.31.0")
        ? [
            OSD_FIELDS.PID_ROLL,
            OSD_FIELDS.PID_PITCH,
            OSD_FIELDS.PID_YAW,
            OSD_FIELDS.POWER
          ]
        : []),
      ...(semver.gte(apiVersion, "1.32.0")
        ? [
            OSD_FIELDS.PID_RATE_PROFILE,
            semver.gte(apiVersion, "1.36.0")
              ? OSD_FIELDS.WARNINGS
              : OSD_FIELDS.BATTERY_WARNING,
            OSD_FIELDS.AVG_CELL_VOLTAGE
          ]
        : []),
      ...(semver.gte(apiVersion, "1.34.0")
        ? [OSD_FIELDS.GPS_LON, OSD_FIELDS.GPS_LAT, OSD_FIELDS.DEBUG]
        : []),
      ...(semver.gte(apiVersion, "1.35.0")
        ? [OSD_FIELDS.PITCH_ANGLE, OSD_FIELDS.ROLL_ANGLE]
        : []),
      ...(semver.gte(apiVersion, "1.36.0")
        ? [
            OSD_FIELDS.MAIN_BATT_USAGE,
            OSD_FIELDS.DISARMED,
            OSD_FIELDS.HOME_DIR,
            OSD_FIELDS.HOME_DIST,
            OSD_FIELDS.NUMERICAL_HEADING,
            OSD_FIELDS.NUMERICAL_VARIO,
            OSD_FIELDS.COMPASS_BAR,
            OSD_FIELDS.ESC_TEMPERATURE,
            OSD_FIELDS.ESC_RPM
          ]
        : []),
      ...(semver.gte(apiVersion, "1.37.0")
        ? [
            OSD_FIELDS.REMAINING_TIME_ESTIMATE,
            OSD_FIELDS.RTC_DATE_TIME,
            OSD_FIELDS.ADJUSTMENT_RANGE,
            OSD_FIELDS.CORE_TEMPERATURE
          ]
        : []),
      ...(semver.gte(apiVersion, "1.39.0") ? [OSD_FIELDS.ANTI_GRAVITY] : []),
      ...(semver.gte(apiVersion, "1.40.0") ? [OSD_FIELDS.G_FORCE] : []),
      ...(semver.gte(apiVersion, "1.41.0")
        ? [
            OSD_FIELDS.MOTOR_DIAG,
            OSD_FIELDS.LOG_STATUS,
            OSD_FIELDS.FLIP_ARROW,
            OSD_FIELDS.LINK_QUALITY,
            OSD_FIELDS.FLIGHT_DIST,
            OSD_FIELDS.STICK_OVERLAY_LEFT,
            OSD_FIELDS.STICK_OVERLAY_RIGHT,
            OSD_FIELDS.DISPLAY_NAME,
            OSD_FIELDS.ESC_RPM_FREQ
          ]
        : []),
      ...(semver.gte(apiVersion, "1.42.0")
        ? [
            OSD_FIELDS.RATE_PROFILE_NAME,
            OSD_FIELDS.PID_PROFILE_NAME,
            OSD_FIELDS.OSD_PROFILE_NAME,
            OSD_FIELDS.RSSI_DBM_VALUE
          ]
        : []),
      ...(semver.gte(apiVersion, "1.43.0")
        ? [OSD_FIELDS.RC_CHANNELS, OSD_FIELDS.CAMERA_FRAME]
        : [])
    ];
  }
  // version 3.0.0

  return [
    OSD_FIELDS.MAIN_BATT_VOLTAGE,
    OSD_FIELDS.RSSI_VALUE,
    OSD_FIELDS.TIMER,
    OSD_FIELDS.THROTTLE_POSITION,
    OSD_FIELDS.CPU_LOAD,
    OSD_FIELDS.VTX_CHANNEL,
    OSD_FIELDS.VOLTAGE_WARNING,
    OSD_FIELDS.ARMED,
    OSD_FIELDS.DISARMED,
    OSD_FIELDS.ARTIFICIAL_HORIZON,
    OSD_FIELDS.HORIZON_SIDEBARS,
    OSD_FIELDS.CURRENT_DRAW,
    OSD_FIELDS.MAH_DRAWN,
    OSD_FIELDS.CRAFT_NAME,
    OSD_FIELDS.ALTITUDE
  ];
};

export enum OSD_STATIC_FIELDS {
  MAX_SPEED,
  MIN_BATTERY,
  MIN_RSSI,
  MAX_CURRENT,
  USED_MAH,
  MAX_ALTITUDE,
  BLACKBOX,
  END_BATTERY,
  TIMER_1,
  TIMER_2,
  MAX_DISTANCE,
  BLACKBOX_LOG_NUMBER,
  RTC_DATE_TIME,
  STAT_BATTERY,
  MAX_G_FORCE,
  MAX_ESC_TEMP,
  MAX_ESC_RPM,
  MIN_LINK_QUALITY,
  FLIGHT_DISTANCE,
  MAX_FFT,
  TOTAL_FLIGHTS,
  TOTAL_FLIGHT_TIME,
  TOTAL_FLIGHT_DIST,
  MIN_RSSI_DBM,
  UNKNOWN
}

export const osdStaticFields = (apiVersion: string): OSD_STATIC_FIELDS[] => {
  if (semver.lt(apiVersion, "1.39.0")) {
    return [
      OSD_STATIC_FIELDS.MAX_SPEED,
      OSD_STATIC_FIELDS.MIN_BATTERY,
      OSD_STATIC_FIELDS.MIN_RSSI,
      OSD_STATIC_FIELDS.MAX_CURRENT,
      OSD_STATIC_FIELDS.USED_MAH,
      OSD_STATIC_FIELDS.MAX_ALTITUDE,
      OSD_STATIC_FIELDS.BLACKBOX,
      OSD_STATIC_FIELDS.END_BATTERY,
      OSD_STATIC_FIELDS.TIMER_1,
      OSD_STATIC_FIELDS.TIMER_2,
      OSD_STATIC_FIELDS.MAX_DISTANCE,
      OSD_STATIC_FIELDS.BLACKBOX_LOG_NUMBER,
      ...(semver.gte(apiVersion, "1.37.0")
        ? [OSD_STATIC_FIELDS.RTC_DATE_TIME]
        : [])
    ];
  }
  // Starting with 1.39.0 OSD stats are reordered to match how they're presented on screen
  return [
    OSD_STATIC_FIELDS.RTC_DATE_TIME,
    OSD_STATIC_FIELDS.TIMER_1,
    OSD_STATIC_FIELDS.TIMER_2,
    OSD_STATIC_FIELDS.MAX_SPEED,
    OSD_STATIC_FIELDS.MAX_DISTANCE,
    OSD_STATIC_FIELDS.MIN_BATTERY,
    OSD_STATIC_FIELDS.END_BATTERY,
    OSD_STATIC_FIELDS.STAT_BATTERY,
    OSD_STATIC_FIELDS.MIN_RSSI,
    OSD_STATIC_FIELDS.MAX_CURRENT,
    OSD_STATIC_FIELDS.USED_MAH,
    OSD_STATIC_FIELDS.MAX_ALTITUDE,
    OSD_STATIC_FIELDS.BLACKBOX,
    OSD_STATIC_FIELDS.BLACKBOX_LOG_NUMBER,
    ...(semver.gte(apiVersion, "1.41.0")
      ? [
          OSD_STATIC_FIELDS.MAX_G_FORCE,
          OSD_STATIC_FIELDS.MAX_ESC_TEMP,
          OSD_STATIC_FIELDS.MAX_ESC_RPM,
          OSD_STATIC_FIELDS.MIN_LINK_QUALITY,
          OSD_STATIC_FIELDS.FLIGHT_DISTANCE,
          OSD_STATIC_FIELDS.MAX_FFT
        ]
      : []),
    ...(semver.gte(apiVersion, "1.42.0")
      ? [
          OSD_STATIC_FIELDS.TOTAL_FLIGHTS,
          OSD_STATIC_FIELDS.TOTAL_FLIGHT_TIME,
          OSD_STATIC_FIELDS.TOTAL_FLIGHT_DIST,
          OSD_STATIC_FIELDS.MIN_RSSI_DBM
        ]
      : [])
  ];
};

export enum OSD_WARNINGS {
  ARMING_DISABLED,
  BATTERY_NOT_FULL,
  BATTERY_WARNING,
  BATTERY_CRITICAL,
  VISUAL_BEEPER,
  CRASH_FLIP_MODE,
  ESC_FAIL,
  CORE_TEMPERATURE,
  RC_SMOOTHING_FAILURE,
  FAILSAFE,
  LAUNCH_CONTROL,
  GPS_RESCUE_UNAVAILABLE,
  GPS_RESCUE_DISABLED,
  RSSI,
  LINK_QUALITY,
  RSSI_DBM,
  OVER_CAP,
  UNKNOWN
}

export const osdWarnings = (apiVersion: string): OSD_WARNINGS[] => [
  OSD_WARNINGS.ARMING_DISABLED,
  OSD_WARNINGS.BATTERY_NOT_FULL,
  OSD_WARNINGS.BATTERY_WARNING,
  OSD_WARNINGS.BATTERY_CRITICAL,
  OSD_WARNINGS.VISUAL_BEEPER,
  OSD_WARNINGS.CRASH_FLIP_MODE,
  ...(semver.gte(apiVersion, "1.39.0")
    ? [
        OSD_WARNINGS.ESC_FAIL,
        OSD_WARNINGS.CORE_TEMPERATURE,
        OSD_WARNINGS.RC_SMOOTHING_FAILURE
      ]
    : []),
  ...(semver.gte(apiVersion, "1.41.0")
    ? [
        OSD_WARNINGS.FAILSAFE,
        OSD_WARNINGS.LAUNCH_CONTROL,
        OSD_WARNINGS.GPS_RESCUE_UNAVAILABLE,
        OSD_WARNINGS.GPS_RESCUE_DISABLED
      ]
    : []),
  ...(semver.gte(apiVersion, "1.42.0")
    ? [OSD_WARNINGS.RSSI, OSD_WARNINGS.LINK_QUALITY, OSD_WARNINGS.RSSI_DBM]
    : []),
  ...(semver.gte(apiVersion, "1.43.0") ? [OSD_WARNINGS.OVER_CAP] : [])
];

export enum OSD_TIMERS {
  ON_TIME,
  TOTAL_ARMED_TIME,
  LAST_ARMED_TIME,
  ON_ARM_TIME,
  UNKNOWN
}

export const osdTimers = (apiVersion: string): OSD_TIMERS[] => [
  OSD_TIMERS.ON_TIME,
  OSD_TIMERS.TOTAL_ARMED_TIME,
  OSD_TIMERS.LAST_ARMED_TIME,
  ...(semver.gte(apiVersion, "1.42.0") ? [OSD_TIMERS.ON_ARM_TIME] : [])
];
