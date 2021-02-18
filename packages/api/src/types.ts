export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type VoltageMeters = {
  id: number;
  voltage: number;
};

export type AnalogValues = {
  voltage: number;
  mahDrawn: number;
  rssi: number;
  amperage: number;
};

export type RawGpsData = {
  fix: boolean;
  numSat: number;
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  groundCourse: number;
};

export type BoardInfo = {
  boardIdentifier: string;
  boardVersion: number;
  boardType: number;
  targetCapabilities: number;
  targetName: string;
  boardName: string;
  manufacturerId: string;
  signature: number[];
  mcuTypeId: McuTypes;
  configurationState: number | undefined;
  sampleRateHz: number | undefined;
};

export type ImuUnit = [number, number, number];

export type ImuData = {
  accelerometer: ImuUnit;
  gyroscope: ImuUnit;
  magnetometer: ImuUnit;
};

export type Axes3D = {
  roll: number;
  pitch: number;
  yaw: number;
};

export type Status = {
  cycleTime: number;
  i2cError: number;
  sensors: Sensors[];
  mode: number;
  profile: number;
};

export type ExtendedStatus = Status & {
  cpuload: number;
  numProfiles: number;
  rateProfile: number;
  armingDisabledFlags: DisarmFlags[];
};

export enum FilterTypes {
  PT1 = 0,
  BIQUAD = 1,
}

export type LowpassFilter = {
  hz: number;
  type: FilterTypes;
};

export type NotchFilter = {
  hz: number;
  cutoff: number;
};

export type FilterConfig = {
  gryo: {
    hardwareLPF: number;
    hardware32KhzLPF: number;
    rpmNotchHarmonics: number;
    rpmNotchMinHz: number;
    lowpass: LowpassFilter & {
      dynMinHz: number;
      dynMaxHz: number;
    };
    lowpass2: LowpassFilter;
    notch: NotchFilter;
    notch2: NotchFilter;
  };
  derm: {
    lowpass: LowpassFilter & {
      dynMinHz: number;
      dynMaxHz: number;
    };
    lowpass2: LowpassFilter;
    notch: NotchFilter & {
      range: number;
      widthPercent: number;
      q: number;
      minHz: number;
      maxHz: number;
    };
  };
  yaw: {
    lowpass: {
      hz: number;
    };
  };
  dynLpfCurveExpo: 0;
};

export enum EscProtocols {
  PWM,
  ONESHOT125,
  ONESHOT42,
  MULTISHOT,
  BRUSHED,
  DSHOT150,
  DSHOT300,
  DSHOT600,
  DSHOT1200,
  PROSHOT1000,
  DISABLED,
}

export type AdvancedPidConfig = {
  gyroSyncDenom: number;
  pidProcessDenom: number;
  useUnsyncedPwm: boolean;
  fastPwmProtocol: EscProtocols;
  gyroUse32kHz: boolean;
  motorPwmRate: number;
  gyroToUse: number;
  digitalIdlePercent: number;
  motorPwmInversion: number;
  gyroHighFsr: number;
  gyroMovementCalibThreshold: number;
  gyroCalibDuration: number;
  gyroOffsetYaw: number;
  gyroCheckOverflow: number;
  debugMode: number;
  debugModeCount: number;
};

export type RCTuning = {
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
};

export type RCDeadband = {
  deadband: number;
  yawDeadband: number;
  altHoldDeadhand: number;
  deadband3dThrottle: number;
};

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

export enum DisarmFlags {
  NO_GYRO,
  FAILSAFE,
  RX_FAILSAFE,
  BAD_RX_RECOVERY,
  BOXFAILSAFE,
  THROTTLE,
  ANGLE,
  BOOT_GRACE_TIME,
  NOPREARM,
  LOAD,
  CALIBRATING,
  CLI,
  CMS_MENU,
  OSD_MENU,
  BST,
  MSP,
  RUNAWAY_TAKEOFF,
  PARALYZE,
  GPS,
  RESC,
  RPMFILTER,
  CRASH,
  REBOOT_REQD,
  DSHOT_BBANG,
  NO_ACC_CAL,
  ARM_SWITCH,
  UNKNOWN,
}

export enum Sensors {
  ACCELEROMETER,
  BAROMETER,
  MAGNETOMETER,
  GPS,
  SONAR,
  GYRO,
  UNKNOWN,
}

export type FeatureBits = Record<number, Features>;

export type Feature = {
  key: Features;
  enabled: boolean;
};

export enum SerialPortFunctions {
  MSP,
  GPS,
  TELEMETRY_FRSKY,
  TELEMETRY_HOTT,
  TELEMETRY_MSP,
  TELEMETRY_LTM,
  TELEMETRY_SMARTPORT,
  RX_SERIAL,
  BLACKBOX,
  TELEMETRY_MAVLINK,
  ESC_SENSOR,
  TBS_SMARTAUDIO,
  TELEMETRY_IBUS,
  IRC_TRAMP,
  RUNCAM_DEVICE_CONTROL,
  LIDAR_TF,
  UNKNOWN,
}

export type PortSettings = {
  id: number;
  functions: SerialPortFunctions[];
  mspBaudRate: number;
  gpsBaudRate: number;
  telemetryBaudRate: number;
  blackboxBaudRate: number;
};

export type LegacyBaudRates = {
  mspBaudRate: number;
  cliBaudRate: number;
  gpsBaudRate: number;
  gpsPassthroughBaudRate: number;
};

export type SerialConfig = {
  ports: PortSettings[];
  legacy?: LegacyBaudRates;
};

export enum RebootTypes {
  FIRMWARE = 0,
  BOOTLOADER = 1,
  MSC = 2,
  MSC_UTC = 3,
}

export enum McuTypes {
  SIMULATOR = 0,
  F103,
  F303,
  F40X,
  F411,
  F446,
  F722,
  F745,
  F746,
  F765,
  H750,
  H743_REV_UNKNOWN,
  H743_REV_Y,
  H743_REV_X,
  H743_REV_V,
  H7A3,
  H723_725,
  UNKNOWN = 255,
}

export type MixerConfig = {
  mixer: number;
  reversedMotors: boolean;
};

export enum Beepers {
  GYRO_CALIBRATED,
  RX_LOST,
  RX_LOST_LANDING,
  DISARMING,
  ARMING,
  ARMING_GPS_FIX,
  BAT_CRIT_LOW,
  BAT_LOW,
  GPS_STATUS,
  RX_SET,
  ACC_CALIBRATION,
  ACC_CALIBRATION_FAIL,
  READY_BEEP,
  MULTI_BEEPS,
  DISARM_REPEAT,
  ARMED,
  SYSTEM_INIT,
  USB,
  BLACKBOX_ERASE,
  CRASH_FLIP,
  CAM_CONNECTION_OPEN,
  CAM_CONNECTION_CLOSE,
  RC_SMOOTHING_INIT_FAIL,
}

export type BeeperConfig = {
  conditions: Beepers[];
  dshot: {
    conditions: (Beepers.RX_LOST | Beepers.RX_SET)[];
    tone: number;
  };
};

export enum SerialRxProviders {
  SPEKTRUM1024,
  SBUS,
  SUMD,
  SUMH,
  XBUS_MODE_B,
  XBUS_MODE_B_RJ01,
  IBUS,
  JETIEXBUS,
  CRSF,
  SPEKTRUM2048,
  SPEKTRUM2048_SRXL,
  TARGET_CUSTOM,
  FRSKY_FPORT,
  SPEKTRUM_SRXL2,
}

export enum SpiRxProtocols {
  NRF24_V202_250K,
  NRF24_V202_1M,
  NRF24_SYMA_X,
  NRF24_SYMA_X5C,
  NRF24_CX10,
  CX10A,
  NRF24_H8_3D,
  NRF24_INAV,
  FRSKY_D,
  FRSKY_X,
  A7105_FLYSKY,
  A7105_FLYSKY_2A,
  NRF24_KN,
  SFHSS,
  SPEKTRUM,
  FRSKY_X_LBT,
}

export enum RcInterpolations {
  OFF,
  DEFAULT,
  AUTO,
  MANUAL,
}

export enum RcSmoothingChannels {
  RP,
  RPY,
  RPYT,
  T,
  RPT,
}

export enum RcSmoothingTypes {
  INTERPOLATION,
  FILTER,
}

export enum RcSmoothingInputTypes {
  PT1,
  BIQUAD,
}

export enum RcSmoothingDerivativeTypes {
  OFF,
  PT1,
  BIQUAD,
  AUTO,
}

export type RxConfig = {
  serialProvider: SerialRxProviders;
  stick: {
    max: number;
    center: number;
    min: number;
  };
  spektrumSatBind: number;
  rxMinUsec: number;
  rxMaxUsec: number;
  interpolation: RcInterpolations;
  interpolationInterval: number;
  airModeActivateThreshold: number;
  spi: {
    protocol: SpiRxProtocols;
    id: number;
    rfChannelCount: number;
  };
  fpvCamAngleDegrees: number;
  rcSmoothing: {
    channels: RcSmoothingChannels;
    type: RcSmoothingTypes;
    inputCutoff: number;
    derivativeCutoff: number;
    inputType: RcSmoothingInputTypes;
    derivativeType: RcSmoothingDerivativeTypes;
    autoSmoothness: number;
  };
  usbCdcHidType: number;
};
