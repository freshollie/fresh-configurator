import semver from "semver";
import {
  OSD_FIELDS,
  OSD_STATIC_FIELDS,
  OSD_WARNINGS,
  OSD_TIMER_SOURCES,
  OSD_ALARMS,
  OSD_UNIT_TYPES,
  OSD_VIDEO_TYPES,
  OSD_PRECISION_TYPES,
} from "./types";
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
            OSD_FIELDS.POWER,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.32.0")
        ? [
            OSD_FIELDS.PID_RATE_PROFILE,
            semver.gte(apiVersion, "1.36.0")
              ? OSD_FIELDS.WARNINGS
              : OSD_FIELDS.BATTERY_WARNING,
            OSD_FIELDS.AVG_CELL_VOLTAGE,
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
            OSD_FIELDS.ESC_RPM,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.37.0")
        ? [
            OSD_FIELDS.REMAINING_TIME_ESTIMATE,
            OSD_FIELDS.RTC_DATE_TIME,
            OSD_FIELDS.ADJUSTMENT_RANGE,
            OSD_FIELDS.CORE_TEMPERATURE,
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
            OSD_FIELDS.ESC_RPM_FREQ,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.42.0")
        ? [
            OSD_FIELDS.RATE_PROFILE_NAME,
            OSD_FIELDS.PID_PROFILE_NAME,
            OSD_FIELDS.OSD_PROFILE_NAME,
            OSD_FIELDS.RSSI_DBM_VALUE,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.43.0")
        ? [OSD_FIELDS.RC_CHANNELS, OSD_FIELDS.CAMERA_FRAME]
        : []),
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
    OSD_FIELDS.ALTITUDE,
  ];
};

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
        : []),
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
          OSD_STATIC_FIELDS.MAX_FFT,
        ]
      : []),
    ...(semver.gte(apiVersion, "1.42.0")
      ? [
          OSD_STATIC_FIELDS.TOTAL_FLIGHTS,
          OSD_STATIC_FIELDS.TOTAL_FLIGHT_TIME,
          OSD_STATIC_FIELDS.TOTAL_FLIGHT_DIST,
          OSD_STATIC_FIELDS.MIN_RSSI_DBM,
        ]
      : []),
  ];
};

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
        OSD_WARNINGS.RC_SMOOTHING_FAILURE,
      ]
    : []),
  ...(semver.gte(apiVersion, "1.41.0")
    ? [
        OSD_WARNINGS.FAILSAFE,
        OSD_WARNINGS.LAUNCH_CONTROL,
        OSD_WARNINGS.GPS_RESCUE_UNAVAILABLE,
        OSD_WARNINGS.GPS_RESCUE_DISABLED,
      ]
    : []),
  ...(semver.gte(apiVersion, "1.42.0")
    ? [OSD_WARNINGS.RSSI, OSD_WARNINGS.LINK_QUALITY, OSD_WARNINGS.RSSI_DBM]
    : []),
  ...(semver.gte(apiVersion, "1.43.0") ? [OSD_WARNINGS.OVER_CAP] : []),
];

export const osdTimerSources = (apiVersion: string): OSD_TIMER_SOURCES[] => [
  OSD_TIMER_SOURCES.ON_TIME,
  OSD_TIMER_SOURCES.TOTAL_ARMED_TIME,
  OSD_TIMER_SOURCES.LAST_ARMED_TIME,
  ...(semver.gte(apiVersion, "1.42.0") ? [OSD_TIMER_SOURCES.ON_ARM_TIME] : []),
];

export const osdAlarms = (): OSD_ALARMS[] => [
  OSD_ALARMS.RSSI,
  OSD_ALARMS.CAP,
  OSD_ALARMS.TIME,
  OSD_ALARMS.ALT,
];

export const OSD_UNIT_VALUE_TO_TYPE = [
  OSD_UNIT_TYPES.IMPERIAL,
  OSD_UNIT_TYPES.METRIC,
];
export const OSD_VIDEO_VALUE_TO_TYPE = [
  OSD_VIDEO_TYPES.AUTO,
  OSD_VIDEO_TYPES.PAL,
  OSD_VIDEO_TYPES.NTSC,
];
export const OSD_PRECISION_VALUE_TO_TYPE = [
  OSD_PRECISION_TYPES.SECOND,
  OSD_PRECISION_TYPES.HUNDREDTH,
  OSD_PRECISION_TYPES.TENTH,
];

export const OSD_VALUE_VISIBLE = 0x0800;
