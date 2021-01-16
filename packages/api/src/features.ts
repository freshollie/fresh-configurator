import semver from "semver";
import {
  FeatureBits,
  Features,
  DisarmFlags,
  Sensors,
  SerialPortFunctions,
  EscProtocols,
  McuTypes,
  Beepers,
} from "./types";

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

export const serialPortFunctionBits = (): SerialPortFunctions[] => [
  SerialPortFunctions.MSP,
  SerialPortFunctions.GPS,
  SerialPortFunctions.TELEMETRY_FRSKY,
  SerialPortFunctions.TELEMETRY_HOTT,
  SerialPortFunctions.TELEMETRY_LTM,
  SerialPortFunctions.TELEMETRY_SMARTPORT,
  SerialPortFunctions.RX_SERIAL,
  SerialPortFunctions.BLACKBOX,
  SerialPortFunctions.UNKNOWN,
  SerialPortFunctions.TELEMETRY_MAVLINK,
  SerialPortFunctions.ESC_SENSOR,
  SerialPortFunctions.TBS_SMARTAUDIO,
  SerialPortFunctions.TELEMETRY_IBUS,
  SerialPortFunctions.IRC_TRAMP,
  SerialPortFunctions.RUNCAM_DEVICE_CONTROL,
  SerialPortFunctions.LIDAR_TF,
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
  ...(semver.gte(apiVersion, "1.37.0")
    ? [
        Beepers.CRASH_FLIP,
        Beepers.CAM_CONNECTION_OPEN,
        Beepers.CAM_CONNECTION_CLOSE,
      ]
    : []),
  ...(semver.gte(apiVersion, "1.39.0") ? [Beepers.RC_SMOOTHING_INIT_FAIL] : []),
];

export const legacySerialPortFunctionsMap: Record<
  number,
  SerialPortFunctions[] | undefined
> = {
  1: [SerialPortFunctions.MSP],
  5: [SerialPortFunctions.MSP],
  8: [SerialPortFunctions.MSP],
  2: [SerialPortFunctions.GPS],
  3: [SerialPortFunctions.RX_SERIAL],
  10: [SerialPortFunctions.BLACKBOX],
  11: [SerialPortFunctions.MSP, SerialPortFunctions.BLACKBOX],
};

export const escProtocols = (version: string): EscProtocols[] => [
  EscProtocols.PWM,
  EscProtocols.ONESHOT125,
  EscProtocols.ONESHOT42,
  EscProtocols.MULTISHOT,
  ...(semver.gte(version, "1.20.0") ? [EscProtocols.BRUSHED] : []),
  ...(semver.gte(version, "1.31.0")
    ? [EscProtocols.DSHOT150, EscProtocols.DSHOT300, EscProtocols.DSHOT600]
    : []),
  ...(semver.gte(version, "1.31.0") && semver.lt(version, "1.42.0")
    ? [EscProtocols.DSHOT1200]
    : []),
  ...(semver.gte(version, "1.36.0") ? [EscProtocols.PROSHOT1000] : []),
  ...(semver.gte(version, "1.43.0") ? [EscProtocols.DISABLED] : []),
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
