import semver from "semver";
import {
  OSDFields,
  OSDStaticFields,
  OSDWarnings,
  OSDTimerSources,
  OSDAlarms,
  OSDUnitTypes,
  OSDVideoTypes,
  OSDPrecisionTypes,
} from "./types";
/**
 * Return the OSD fields in their data read order
 * based on the given api version
 */
export const osdFields = (apiVersion: string): OSDFields[] => {
  // version 3.0.1
  if (semver.gte(apiVersion, "1.21.0")) {
    return [
      OSDFields.RSSI_VALUE,
      OSDFields.MAIN_BATT_VOLTAGE,
      OSDFields.CROSSHAIRS,
      OSDFields.ARTIFICIAL_HORIZON,
      OSDFields.HORIZON_SIDEBARS,
      ...(semver.lt(apiVersion, "1.36.0")
        ? [OSDFields.ONTIME, OSDFields.FLYTIME]
        : [OSDFields.TIMER_1, OSDFields.TIMER_2]),
      OSDFields.FLYMODE,
      OSDFields.CRAFT_NAME,
      OSDFields.THROTTLE_POSITION,
      OSDFields.VTX_CHANNEL,
      OSDFields.CURRENT_DRAW,
      OSDFields.MAH_DRAWN,
      OSDFields.GPS_SPEED,
      OSDFields.GPS_SATS,
      OSDFields.ALTITUDE,
      ...(semver.gte(apiVersion, "1.31.0")
        ? [
            OSDFields.PID_ROLL,
            OSDFields.PID_PITCH,
            OSDFields.PID_YAW,
            OSDFields.POWER,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.32.0")
        ? [
            OSDFields.PID_RATE_PROFILE,
            semver.gte(apiVersion, "1.36.0")
              ? OSDFields.WARNINGS
              : OSDFields.BATTERY_WARNING,
            OSDFields.AVG_CELL_VOLTAGE,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.34.0")
        ? [OSDFields.GPS_LON, OSDFields.GPS_LAT, OSDFields.DEBUG]
        : []),
      ...(semver.gte(apiVersion, "1.35.0")
        ? [OSDFields.PITCH_ANGLE, OSDFields.ROLL_ANGLE]
        : []),
      ...(semver.gte(apiVersion, "1.36.0")
        ? [
            OSDFields.MAIN_BATT_USAGE,
            OSDFields.DISARMED,
            OSDFields.HOME_DIR,
            OSDFields.HOME_DIST,
            OSDFields.NUMERICAL_HEADING,
            OSDFields.NUMERICAL_VARIO,
            OSDFields.COMPASS_BAR,
            OSDFields.ESC_TEMPERATURE,
            OSDFields.ESC_RPM,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.37.0")
        ? [
            OSDFields.REMAINING_TIME_ESTIMATE,
            OSDFields.RTC_DATE_TIME,
            OSDFields.ADJUSTMENT_RANGE,
            OSDFields.CORE_TEMPERATURE,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.39.0") ? [OSDFields.ANTI_GRAVITY] : []),
      ...(semver.gte(apiVersion, "1.40.0") ? [OSDFields.G_FORCE] : []),
      ...(semver.gte(apiVersion, "1.41.0")
        ? [
            OSDFields.MOTOR_DIAG,
            OSDFields.LOG_STATUS,
            OSDFields.FLIP_ARROW,
            OSDFields.LINK_QUALITY,
            OSDFields.FLIGHT_DIST,
            OSDFields.STICK_OVERLAY_LEFT,
            OSDFields.STICK_OVERLAY_RIGHT,
            OSDFields.DISPLAY_NAME,
            OSDFields.ESC_RPM_FREQ,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.42.0")
        ? [
            OSDFields.RATE_PROFILE_NAME,
            OSDFields.PID_PROFILE_NAME,
            OSDFields.OSD_PROFILE_NAME,
            OSDFields.RSSI_DBM_VALUE,
          ]
        : []),
      ...(semver.gte(apiVersion, "1.43.0")
        ? [OSDFields.RC_CHANNELS, OSDFields.CAMERA_FRAME]
        : []),
    ];
  }
  // version 3.0.0

  return [
    OSDFields.MAIN_BATT_VOLTAGE,
    OSDFields.RSSI_VALUE,
    OSDFields.TIMER,
    OSDFields.THROTTLE_POSITION,
    OSDFields.CPU_LOAD,
    OSDFields.VTX_CHANNEL,
    OSDFields.VOLTAGE_WARNING,
    OSDFields.ARMED,
    OSDFields.DISARMED,
    OSDFields.ARTIFICIAL_HORIZON,
    OSDFields.HORIZON_SIDEBARS,
    OSDFields.CURRENT_DRAW,
    OSDFields.MAH_DRAWN,
    OSDFields.CRAFT_NAME,
    OSDFields.ALTITUDE,
  ];
};

export const osdStaticFields = (apiVersion: string): OSDStaticFields[] => {
  if (semver.lt(apiVersion, "1.39.0")) {
    return [
      OSDStaticFields.MAX_SPEED,
      OSDStaticFields.MIN_BATTERY,
      OSDStaticFields.MIN_RSSI,
      OSDStaticFields.MAX_CURRENT,
      OSDStaticFields.USED_MAH,
      OSDStaticFields.MAX_ALTITUDE,
      OSDStaticFields.BLACKBOX,
      OSDStaticFields.END_BATTERY,
      OSDStaticFields.TIMER_1,
      OSDStaticFields.TIMER_2,
      OSDStaticFields.MAX_DISTANCE,
      OSDStaticFields.BLACKBOX_LOG_NUMBER,
      ...(semver.gte(apiVersion, "1.37.0")
        ? [OSDStaticFields.RTC_DATE_TIME]
        : []),
    ];
  }
  // Starting with 1.39.0 OSD stats are reordered to match how they're presented on screen
  return [
    OSDStaticFields.RTC_DATE_TIME,
    OSDStaticFields.TIMER_1,
    OSDStaticFields.TIMER_2,
    OSDStaticFields.MAX_SPEED,
    OSDStaticFields.MAX_DISTANCE,
    OSDStaticFields.MIN_BATTERY,
    OSDStaticFields.END_BATTERY,
    OSDStaticFields.STAT_BATTERY,
    OSDStaticFields.MIN_RSSI,
    OSDStaticFields.MAX_CURRENT,
    OSDStaticFields.USED_MAH,
    OSDStaticFields.MAX_ALTITUDE,
    OSDStaticFields.BLACKBOX,
    OSDStaticFields.BLACKBOX_LOG_NUMBER,
    ...(semver.gte(apiVersion, "1.41.0")
      ? [
          OSDStaticFields.MAX_G_FORCE,
          OSDStaticFields.MAX_ESC_TEMP,
          OSDStaticFields.MAX_ESC_RPM,
          OSDStaticFields.MIN_LINK_QUALITY,
          OSDStaticFields.FLIGHT_DISTANCE,
          OSDStaticFields.MAX_FFT,
        ]
      : []),
    ...(semver.gte(apiVersion, "1.42.0")
      ? [
          OSDStaticFields.TOTAL_FLIGHTS,
          OSDStaticFields.TOTAL_FLIGHT_TIME,
          OSDStaticFields.TOTAL_FLIGHT_DIST,
          OSDStaticFields.MIN_RSSI_DBM,
        ]
      : []),
  ];
};

export const osdWarnings = (apiVersion: string): OSDWarnings[] => [
  OSDWarnings.ARMING_DISABLED,
  OSDWarnings.BATTERY_NOT_FULL,
  OSDWarnings.BATTERY_WARNING,
  OSDWarnings.BATTERY_CRITICAL,
  OSDWarnings.VISUAL_BEEPER,
  OSDWarnings.CRASH_FLIP_MODE,
  ...(semver.gte(apiVersion, "1.39.0")
    ? [
        OSDWarnings.ESC_FAIL,
        OSDWarnings.CORE_TEMPERATURE,
        OSDWarnings.RC_SMOOTHING_FAILURE,
      ]
    : []),
  ...(semver.gte(apiVersion, "1.41.0")
    ? [
        OSDWarnings.FAILSAFE,
        OSDWarnings.LAUNCH_CONTROL,
        OSDWarnings.GPS_RESCUE_UNAVAILABLE,
        OSDWarnings.GPS_RESCUE_DISABLED,
      ]
    : []),
  ...(semver.gte(apiVersion, "1.42.0")
    ? [OSDWarnings.RSSI, OSDWarnings.LINK_QUALITY, OSDWarnings.RSSI_DBM]
    : []),
  ...(semver.gte(apiVersion, "1.43.0") ? [OSDWarnings.OVER_CAP] : []),
];

export const osdTimerSources = (apiVersion: string): OSDTimerSources[] => [
  OSDTimerSources.ON_TIME,
  OSDTimerSources.TOTAL_ARMED_TIME,
  OSDTimerSources.LAST_ARMED_TIME,
  ...(semver.gte(apiVersion, "1.42.0") ? [OSDTimerSources.ON_ARM_TIME] : []),
];

export const osdAlarms = (): OSDAlarms[] => [
  OSDAlarms.RSSI,
  OSDAlarms.CAP,
  OSDAlarms.TIME,
  OSDAlarms.ALT,
];

export const OSD_UNIT_VALUE_TO_TYPE = [
  OSDUnitTypes.IMPERIAL,
  OSDUnitTypes.METRIC,
];
export const OSD_VIDEO_VALUE_TO_TYPE = [
  OSDVideoTypes.AUTO,
  OSDVideoTypes.PAL,
  OSDVideoTypes.NTSC,
];
export const OSD_PRECISION_VALUE_TO_TYPE = [
  OSDPrecisionTypes.SECOND,
  OSDPrecisionTypes.HUNDREDTH,
  OSDPrecisionTypes.TENTH,
];

export const OSD_VALUE_VISIBLE = 0x0800;
