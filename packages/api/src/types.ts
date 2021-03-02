import { TupleOf } from "./utils";

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
  id: SerialPortIdentifiers;
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

export enum SerialPortIdentifiers {
  UART1 = 0,
  UART2 = 1,
  UART3 = 2,
  UART4 = 3,
  UART5 = 4,
  UART6 = 5,
  UART7 = 6,
  UART8 = 7,
  UART9 = 8,
  UART10 = 9,
  USB_VCP = 20,
  SOFTSERIAL1 = 30,
  SOFTSERIAL2 = 31,
}

export type ChannelLetter = "A" | "E" | "R" | "T" | "1" | "2" | "3" | "4";
export type ChannelMap = TupleOf<ChannelLetter, 8>;

export enum GpsProtocols {
  NMEA,
  UBLOX,
  MSP,
}

export enum GpsSbasTypes {
  AUTO,
  EGNOS,
  WAAS,
  MSAS,
  GAGAN,
}

export enum GpsBaudRates {
  BAUD_115200,
  BAUD_57600,
  BAUD_38400,
  BAUD_19200,
  BAUD_9600,
}

export type RssiConfig = {
  channel: number;
};

export type GpsConfig = {
  provider: GpsProtocols;
  ubloxSbas: GpsSbasTypes;
  autoConfig: boolean;
  autoBaud: boolean;
  homePointOnce: boolean;
  ubloxUseGalileo: boolean;
};

export enum Modes {
  // Enables motors and flight stabilisation
  ARM = 0,
  // Legacy auto-level flight mode
  ANGLE = 1,
  // Auto-level flight mode
  HORIZON = 2,
  // Prevents dips and rolls on fast throttle changes
  ANTI_GRAVITY = 4,
  // Heading lock
  MAG = 5,
  // Head Free - When enabled yaw has no effect on pitch/roll inputs
  HEAD_FREE = 6,
  // Heading Adjust - Sets a new yaw origin for HEADFREE mode
  HEAD_ADJ = 7,
  // Camera Stabilisation
  CAM_STAB = 8,
  // Pass roll, yaw, and pitch directly from rx to servos in airplane mix
  PASSTHRU = 12,
  // Enable beeping - useful for locating a crashed aircraft
  BEEPER_ON = 13,
  // Switch off LED_STRIP output
  LED_LOW = 14,
  // Start in-flight calibration
  CALIB = 17,
  // Enable/Disable On-Screen-Display (OSD)
  OSD = 19,
  // Enable telemetry via switch
  TELEMETRY = 20,
  //	Servo 1
  SERVO1 = 23,
  // Servo 2
  SERVO2 = 24,
  // Servo 3
  SERVO3 = 25,
  // Enable BlackBox logging
  BLACKBOX = 26,
  // Enter failsafe stage 2 manually
  FAILSAFE = 27,
  // Alternative mixer and additional PID logic for more stable copter
  AIRMODE = 28,
  // Enable 3D mode
  "3D" = 29,
  // Apply yaw rotation relative to a FPV camera mounted at a preset angle
  FPV_ANGLE_MIX = 30,
  // Erase the contents of the onboard flash log chip (takes > 30 s)
  BLACKBOX_ERASE = 31,
  // Control function 1 of the onboard camera (if supported)
  CAMERA_CONTROL_1 = 32,
  // Control function 2 of the onboard camera (if supported)
  CAMERA_CONTROL_2 = 33,
  // Control function 3 of the onboard camera (if supported)
  CAMERA_CONTROL_3 = 34,
  // Reverse the motors to flip over an upside down craft after a crash (DShot required)
  FLIP_OVER_AFTER_CRASH = 35,
  // When arming, wait for this switch to be activated before actually arming
  BOX_PRE_ARM = 36,
  // Use a number of beeps to indicate the number of GPS satellites found
  BEEP_GPS_SATELLITE_COUNT = 37,
  // Switch the VTX into pit mode (low output power, if supported)
  VTX_PIT_MODE = 39,
  //	User defined switch 1. Intended to be used to control an arbitrary output with PINIO
  USER1 = 40,
  // User defined switch 2. Intended to be used to control an arbitrary output with PINIO
  USER2 = 41,
  // User defined switch 3. Intended to be used to control an arbitrary output with PINIO
  USER3 = 42,
  // User defined switch 4. Intended to be used to control an arbitrary output with PINIO
  USER4 = 43,
  // Enable output of PID controller state as audio
  PID_AUDIO = 44,
  // Permanently disable a crashed craft until it is power cycled
  PARALYZE = 45,
  // Enable 'GPS Rescue' to return the craft to the location where it was last armed
  GPS_RESCUE = 46,
  // Enable 'acro trainer' angle limiting in acro mode
  ACRO_TRAINER = 47,
  // Disable the control of VTX settings through the OSD
  DISABLE_VTX_CONTROL = 48,
  // Race start assistance system
  LAUNCH_CONTROL = 49,
}

export type ModeSlot = {
  modeId: Modes;
  auxChannel: number;
  range: {
    start: number;
    end: number;
  };
  modeLogic?: number;
  linkedTo?: number;
};
