export type OSDProfileConfig = {
  count: number;
  selected: number;
};

export type OSDTimer = {
  key: number;
  src: OSD_TIMER_SOURCES;
  precision: OSD_PRECISION_TYPES;
  time: number;
};

export type OSDAlarm = {
  key: OSD_ALARMS;
  value: number;
};

export type OSDWarning = {
  key: OSD_WARNINGS;
  enabled: boolean;
};

export type Position = { x: number; y: number };

export type OSDDisplayItem = {
  key: OSD_FIELDS;
  position: Position;
  visibility: boolean[];
};

export type OSDStaticItem = {
  key: OSD_STATIC_FIELDS;
  enabled: boolean;
};

export type OSDFlags = {
  hasOSD: boolean;
  haveMax7456Video: boolean;
  haveOsdFeature: boolean;
  isOsdSlave: boolean;
};

export type OSDParameters = {
  cameraFrameWidth: number;
  cameraFrameHeight: number;
  overlayRadioMode: number;
};

export type OSDConfig = {
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
  parameters: OSDParameters;
};

export type OSDOtherData = {
  flags: OSDFlags;
  videoSystem: OSD_VIDEO_TYPES;
  unitMode: OSD_UNIT_TYPES;
  alarms: OSDAlarm[];
  warnings: OSDWarning[];
  osdProfiles: OSDProfileConfig;
  parameters: OSDParameters;
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
  UNKNOWN,
}

export enum OSD_TIMER_SOURCES {
  ON_TIME,
  TOTAL_ARMED_TIME,
  LAST_ARMED_TIME,
  ON_ARM_TIME,
  UNKNOWN,
}

export enum OSD_ALARMS {
  RSSI,
  CAP,
  TIME,
  ALT,
}

export enum OSD_VIDEO_TYPES {
  AUTO,
  PAL,
  NTSC,
}

export enum OSD_UNIT_TYPES {
  IMPERIAL,
  METRIC,
}

export enum OSD_PRECISION_TYPES {
  SECOND,
  HUNDREDTH,
  TENTH,
}

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
  UNKNOWN,
}

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
  UNKNOWN,
}
