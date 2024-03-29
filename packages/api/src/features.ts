import semver from "semver";
import {
  FeatureBits,
  Features,
  DisarmFlags,
  Sensors,
  EscProtocols,
  McuTypes,
  Beepers,
  SerialRxProviders,
  SpiRxProtocols,
  RcInterpolations,
  RcSmoothingChannels,
  RcSmoothingTypes,
  RcSmoothingInputTypes,
  RcSmoothingDerivativeTypes,
  ChannelLetter,
  GpsProtocols,
  GpsSbasTypes,
  GpsBaudRates,
  BlackboxDevices,
  TargetCapabilities,
} from "./types";
import { includeIf } from "./utils";

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

export const availableFeatures = (apiVersion: string): FeatureBits => {
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
  ...includeIf(semver.gte(apiVersion, "1.38.0"), DisarmFlags.RUNAWAY_TAKEOFF),
  ...includeIf(semver.gte(apiVersion, "1.42.0"), DisarmFlags.CRASH),
  DisarmFlags.ANGLE,
  DisarmFlags.BOOT_GRACE_TIME,
  DisarmFlags.NOPREARM,
  DisarmFlags.LOAD,
  DisarmFlags.CALIBRATING,
  DisarmFlags.CLI,
  DisarmFlags.CMS_MENU,
  ...includeIf(semver.lt(apiVersion, "1.41.0"), DisarmFlags.OSD_MENU),
  DisarmFlags.BST,
  DisarmFlags.MSP,
  ...includeIf(semver.gte(apiVersion, "1.39.0"), [
    DisarmFlags.PARALYZE,
    DisarmFlags.GPS,
  ]),
  ...includeIf(semver.gte(apiVersion, "1.41.0"), [
    DisarmFlags.RESC,
    DisarmFlags.RPMFILTER,
  ]),
  ...includeIf(semver.gte(apiVersion, "1.42.0"), [
    DisarmFlags.REBOOT_REQD,
    DisarmFlags.DSHOT_BBANG,
  ]),
  ...includeIf(semver.gte(apiVersion, "1.43.0"), [DisarmFlags.NO_ACC_CAL]),
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

export const beeperBits = (apiVersion: string): Beepers[] => [
  Beepers.GYRO_CALIBRATED,
  Beepers.RX_LOST,
  Beepers.RX_LOST_LANDING,
  Beepers.DISARMING,
  Beepers.ARMING,
  Beepers.ARMING_GPS_FIX,
  Beepers.BAT_CRIT_LOW,
  Beepers.BAT_LOW,
  Beepers.GPS_STATUS,
  Beepers.RX_SET,
  Beepers.ACC_CALIBRATION,
  Beepers.ACC_CALIBRATION_FAIL,
  Beepers.READY_BEEP,
  Beepers.MULTI_BEEPS,
  Beepers.DISARM_REPEAT,
  Beepers.ARMED,
  Beepers.SYSTEM_INIT,
  Beepers.USB,
  Beepers.BLACKBOX_ERASE,
  ...includeIf(semver.gte(apiVersion, "1.37.0"), [
    Beepers.CRASH_FLIP,
    Beepers.CAM_CONNECTION_OPEN,
    Beepers.CAM_CONNECTION_CLOSE,
  ]),
  ...includeIf(semver.gte(apiVersion, "1.39.0"), [
    Beepers.RC_SMOOTHING_INIT_FAIL,
  ]),
];

export const escProtocols = (version: string): EscProtocols[] => [
  EscProtocols.PWM,
  EscProtocols.ONESHOT125,
  EscProtocols.ONESHOT42,
  EscProtocols.MULTISHOT,
  ...includeIf(semver.gte(version, "1.20.0"), [EscProtocols.BRUSHED]),
  ...includeIf(semver.gte(version, "1.31.0"), [
    EscProtocols.DSHOT150,
    EscProtocols.DSHOT300,
    EscProtocols.DSHOT600,
  ]),
  ...includeIf(semver.gte(version, "1.31.0") && semver.lt(version, "1.42.0"), [
    EscProtocols.DSHOT1200,
  ]),
  ...includeIf(semver.gte(version, "1.36.0"), [EscProtocols.PROSHOT1000]),
  ...includeIf(semver.gte(version, "1.43.0"), [EscProtocols.DISABLED]),
];

export const MCU_GROUPS = {
  F7: [McuTypes.F722, McuTypes.F745, McuTypes.F746, McuTypes.F765],
  F3: [McuTypes.F303],
  F4: [McuTypes.F411, McuTypes.F446],
  H7: [
    McuTypes.H723_725,
    McuTypes.H743_REV_UNKNOWN,
    McuTypes.H743_REV_V,
    McuTypes.H743_REV_X,
    McuTypes.H743_REV_Y,
    McuTypes.H750,
    McuTypes.H7A3,
  ],
  F1: [McuTypes.F103],
};

export const mcuGroupFromId = (
  mcuTypeId: McuTypes
): keyof typeof MCU_GROUPS | undefined =>
  (Object.keys(MCU_GROUPS) as (keyof typeof MCU_GROUPS)[]).find((key) =>
    MCU_GROUPS[key].includes(mcuTypeId)
  );

export const MIXER_LIST = [
  { name: "Tricopter", id: 3, model: "tricopter", image: "tri" },
  { name: "Quad +", id: 2, model: "quad_x", image: "quad_p" },
  { name: "Quad X", id: 0, model: "quad_x", image: "quad_x" },
  { name: "Bicopter", id: 16, model: "custom", image: "bicopter" },
  { name: "Gimbal", id: 4, model: "custom", image: "custom" },
  { name: "Y6", id: 20, model: "y6", image: "y6" },
  { name: "Hex +", id: 5, model: "hex_plus", image: "hex_p" },
  { name: "Flying Wing", id: 10, model: "custom", image: "flying_wing" },
  { name: "Y4", id: 19, model: "y4", image: "y4" },
  { name: "Hex X", id: 6, model: "hex_x", image: "hex_x" },
  { name: "Octo X8", id: 21, model: "custom", image: "octo_x8" },
  { name: "Octo Flat +", id: 8, model: "custom", image: "octo_flat_p" },
  { name: "Octo Flat X", id: 9, model: "custom", image: "octo_flat_x" },
  { name: "Airplane", id: 11, model: "custom", image: "airplane" },
  { name: "Heli 120", id: 12, model: "custom", image: "custom" },
  { name: "Heli 90", id: 13, model: "custom", image: "custom" },
  { name: "V-tail Quad", id: 17, model: "quad_vtail", image: "vtail_quad" },
  { name: "Hex H", id: 7, model: "custom", image: "custom" },
  { name: "PPM to SERVO", id: 22, model: "custom", image: "custom" },
  { name: "Dualcopter", id: 15, model: "custom", image: "custom" },
  { name: "Singlecopter", id: 14, model: "custom", image: "custom" },
  { name: "A-tail Quad", id: 18, model: "quad_atail", image: "atail_quad" },
  { name: "Custom", id: 23, model: "custom", image: "custom" },
  { name: "Custom Airplane", id: 24, model: "custom", image: "custom" },
  { name: "Custom Tricopter", id: 25, model: "custom", image: "custom" },
  { name: "Quad X 1234", id: 1, model: "quad_x", image: "quad_x_1234" },
];

export const serialRxProviders = (apiVersion: string): SerialRxProviders[] => [
  SerialRxProviders.SPEKTRUM1024,
  SerialRxProviders.SPEKTRUM2048,
  SerialRxProviders.SBUS,
  SerialRxProviders.SUMD,
  SerialRxProviders.SUMH,
  SerialRxProviders.XBUS_MODE_B,
  SerialRxProviders.XBUS_MODE_B_RJ01,
  ...includeIf(semver.gte(apiVersion, "1.15.0"), SerialRxProviders.IBUS),
  ...includeIf(semver.gte(apiVersion, "1.31.0"), [
    SerialRxProviders.JETIEXBUS,
    SerialRxProviders.CRSF,
  ]),
  ...includeIf(
    semver.gte(apiVersion, "1.24.0"),
    SerialRxProviders.SPEKTRUM2048_SRXL
  ),
  ...includeIf(
    semver.gte(apiVersion, "1.35.0"),
    SerialRxProviders.TARGET_CUSTOM
  ),
  ...includeIf(semver.gte(apiVersion, "1.37.0"), SerialRxProviders.FRSKY_FPORT),
  ...includeIf(
    semver.gte(apiVersion, "1.42.0"),
    SerialRxProviders.SPEKTRUM_SRXL2
  ),
];

export const spiRxProtocols = (apiVersion: string): SpiRxProtocols[] => [
  SpiRxProtocols.NRF24_V202_250K,
  SpiRxProtocols.NRF24_V202_1M,
  SpiRxProtocols.NRF24_SYMA_X,
  SpiRxProtocols.NRF24_SYMA_X5C,
  SpiRxProtocols.NRF24_CX10,
  SpiRxProtocols.CX10A,
  SpiRxProtocols.NRF24_H8_3D,
  SpiRxProtocols.NRF24_INAV,
  SpiRxProtocols.FRSKY_D,
  ...includeIf(semver.gte(apiVersion, "1.37.0"), [
    SpiRxProtocols.FRSKY_X,
    SpiRxProtocols.A7105_FLYSKY,
    SpiRxProtocols.A7105_FLYSKY_2A,
    SpiRxProtocols.NRF24_KN,
  ]),
  ...includeIf(semver.gte(apiVersion, "1.41.0"), [
    SpiRxProtocols.SFHSS,
    SpiRxProtocols.SPEKTRUM,
    SpiRxProtocols.FRSKY_X_LBT,
  ]),
];

export const rcInterpolations = (): RcInterpolations[] => [
  RcInterpolations.AUTO,
  RcInterpolations.DEFAULT,
  RcInterpolations.MANUAL,
  RcInterpolations.OFF,
];

export const rcSmoothingChannels = (): RcSmoothingChannels[] => [
  RcSmoothingChannels.RP,
  RcSmoothingChannels.RPY,
  RcSmoothingChannels.RPYT,
  RcSmoothingChannels.T,
  RcSmoothingChannels.RPT,
];

export const rcSmoothingTypes = (): RcSmoothingTypes[] => [
  RcSmoothingTypes.INTERPOLATION,
  RcSmoothingTypes.FILTER,
];

export const rcSmoothingInputTypes = (): RcSmoothingInputTypes[] => [
  RcSmoothingInputTypes.PT1,
  RcSmoothingInputTypes.BIQUAD,
];

export const rcSmoothingDerivativeTypes = (
  apiVersion: string
): RcSmoothingDerivativeTypes[] => [
  RcSmoothingDerivativeTypes.OFF,
  RcSmoothingDerivativeTypes.PT1,
  RcSmoothingDerivativeTypes.BIQUAD,
  ...includeIf(
    semver.gte(apiVersion, "1.43.0"),
    RcSmoothingDerivativeTypes.AUTO
  ),
];

export const channelLetters = (): ChannelLetter[] => [
  "A",
  "E",
  "R",
  "T",
  "1",
  "2",
  "3",
  "4",
];

export const gpsProtocols = (apiVersion: string): GpsProtocols[] => [
  GpsProtocols.NMEA,
  GpsProtocols.UBLOX,
  ...includeIf(semver.gte(apiVersion, "1.41.0"), GpsProtocols.MSP),
];

export const gpsSbasTypes = (): GpsSbasTypes[] => [
  GpsSbasTypes.AUTO,
  GpsSbasTypes.EGNOS,
  GpsSbasTypes.WAAS,
  GpsSbasTypes.MSAS,
  GpsSbasTypes.GAGAN,
];

export const gpsBaudRates = (): GpsBaudRates[] => [
  GpsBaudRates.BAUD_115200,
  GpsBaudRates.BAUD_57600,
  GpsBaudRates.BAUD_38400,
  GpsBaudRates.BAUD_19200,
  GpsBaudRates.BAUD_9600,
];

export const blackboxDevices = (api: string): BlackboxDevices[] => [
  semver.gte(api, "1.33.0") ? BlackboxDevices.NONE : BlackboxDevices.SERIAL,
  BlackboxDevices.FLASH,
  BlackboxDevices.SDCARD,
  BlackboxDevices.SERIAL,
];

export const targetCapabilities = (): TargetCapabilities[] => [
  TargetCapabilities.HAS_VCP,
  TargetCapabilities.HAS_SOFTSERIAL,
  TargetCapabilities.IS_UNIFIED,
  TargetCapabilities.HAS_FLASH_BOOTLOADER,
  TargetCapabilities.SUPPORTS_CUSTOM_DEFAULTS,
  TargetCapabilities.HAS_CUSTOM_DEFAULTS,
  TargetCapabilities.SUPPORTS_RX_BIND,
];
