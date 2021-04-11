import semver from "semver";
import {
  MspDataView,
  execute,
  apiVersion,
  WriteBuffer,
  isOpen,
} from "@betaflight/msp";
import codes from "./codes";

import {
  ImuData,
  Axes3D,
  Status,
  ExtendedStatus,
  RCTuning,
  RCDeadband,
  AnalogValues,
  RawGpsData,
  BoardInfo,
  DisarmFlags,
  RebootTypes,
  AdvancedConfig,
  BeeperConfig,
  Beepers,
  Sensors,
  SpiRxProtocols,
  RcInterpolations,
  RcSmoothingChannels,
  RcSmoothingTypes,
  RcSmoothingInputTypes,
  RcSmoothingDerivativeTypes,
  RxConfig,
  Features,
  ChannelMap,
  GpsConfig,
  RssiConfig,
  GpsProtocols,
  GpsSbasTypes,
  BlackboxConfig,
  DataFlashSummary,
  SdCardSummary,
} from "./types";
import {
  availableFeatures,
  disarmFlagBits,
  sensorBits,
  beeperBits,
  escProtocols,
  serialRxProviders,
  spiRxProtocols,
  rcInterpolations,
  rcSmoothingChannels,
  rcSmoothingTypes,
  rcSmoothingInputTypes,
  rcSmoothingDerivativeTypes,
  channelLetters,
  gpsProtocols,
  blackboxDevices,
} from "./features";
import {
  times,
  unpackValues,
  packValues,
  toIdentifier,
  fromIdentifier,
  partialWriteFunc,
  sleep,
} from "./utils";
import { huffmanDecodeBuffer } from "./huffman";

export * from "./osd";
export * from "./power";
export * from "./pid";
export * from "./motors";
export * from "./serial";
export * from "./modes";

export * from "./types";
export {
  apiVersion,
  open,
  close,
  isOpen,
  bytesRead,
  bytesWritten,
  packetErrors,
  ports,
  baudRate,
} from "@betaflight/msp";
export {
  escProtocols,
  serialRxProviders,
  spiRxProtocols,
  rcInterpolations,
  rcSmoothingChannels,
  rcSmoothingTypes,
  rcSmoothingInputTypes,
  rcSmoothingDerivativeTypes,
  MCU_GROUPS,
  mcuGroupFromId,
  MIXER_LIST,
  availableFeatures,
  channelLetters,
  gpsProtocols,
  blackboxDevices,
} from "./features";
export { mergeDeep } from "./utils";

export const readBoardInfo = async (port: string): Promise<BoardInfo> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_BOARD_INFO });

  return {
    boardIdentifier: String.fromCharCode(...times(() => data.readU8(), 4)),
    boardVersion: data.readU16(),
    boardType: semver.gte(api, "1.35.0") ? data.readU8() : 0,
    targetCapabilities: semver.gte(api, "1.37.0") ? data.readU8() : 0,
    targetName: semver.gte(api, "1.37.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    boardName: semver.gte(api, "1.41.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    manufacturerId: semver.gte(api, "1.41.0")
      ? String.fromCharCode(...times(() => data.readU8(), data.readU8()))
      : "",
    signature: semver.gte(api, "1.41.0") ? times(() => data.readU8(), 32) : [],
    mcuTypeId: semver.gte(api, "1.41.0") ? data.readU8() : 255,
    configurationState: semver.gte(api, "1.42.0") ? data.readU8() : undefined,
    sampleRateHz: semver.gte(api, "1.43.0") ? data.readU16() : undefined,
  };
};

export const readFcVariant = async (port: string): Promise<string> => {
  const data = await execute(port, { code: codes.MSP_FC_VARIANT });
  return String.fromCharCode(...times(() => data.readU8(), 4));
};

export const readName = async (port: string): Promise<string> => {
  const data = await execute(port, { code: codes.MSP_NAME });
  return String.fromCharCode(...times(() => data.readU8(), data.byteLength));
};

const MAX_NAME_BUFFER_SIZE = 64;

export const writeName = async (port: string, name: string): Promise<void> => {
  const buffer = Buffer.from(name.slice(0, MAX_NAME_BUFFER_SIZE));
  await execute(port, { code: codes.MSP_SET_NAME, data: buffer });
};

export const readUID = async (port: string): Promise<string> => {
  const data = await execute(port, { code: codes.MSP_UID });
  return times(
    () => (data.readU32() + 16 ** 6).toString(16).substr(-6),
    3
  ).join("");
};

export const readAnalogValues = async (port: string): Promise<AnalogValues> => {
  const data = await execute(port, { code: codes.MSP_ANALOG });

  const values = {
    voltage: data.readU8() / 10.0,
    mahDrawn: data.readU16(),
    rssi: Math.round((data.readU16() / 1023) * 100),
    amperage: data.read16() / 100, // A
  };

  if (semver.gte(apiVersion(port), "1.41.0")) {
    values.voltage = data.readU16() / 100;
  }

  return values;
};

export const readRawGPS = async (port: string): Promise<RawGpsData> => {
  const data = await execute(port, { code: codes.MSP_RAW_GPS });

  return {
    fix: !!data.readU8(),
    numSat: data.readU8(),
    lat: data.read32(),
    lon: data.read32(),
    alt: data.readU16(),
    speed: data.readU16(),
    groundCourse: data.readU16(),
  };
};

export const readIMUData = async (port: string): Promise<ImuData> => {
  const data = await execute(port, { code: codes.MSP_RAW_IMU });

  const accUnit = (): number => data.read16() / 512;
  const gyroUnit = (): number => data.read16() * (4 / 16.4);
  const mangetUnit = (): number => data.read16() / 1090;

  return {
    accelerometer: times(accUnit, 3),
    gyroscope: times(gyroUnit, 3),
    magnetometer: times(mangetUnit, 3),
  };
};

export const readAttitude = async (port: string): Promise<Axes3D> => {
  const data = await execute(port, { code: codes.MSP_ATTITUDE });
  return {
    roll: data.read16() / 10.0, // x
    pitch: data.read16() / 10.0, // y
    yaw: data.read16(), // z
  };
};

const extractStatus = (data: MspDataView): Status => ({
  cycleTime: data.readU16(),
  i2cError: data.readU16(),
  sensors: unpackValues(data.readU16(), sensorBits()),
  mode: data.readU32(),
  profile: data.readU8(),
});

export const readStatus = async (port: string): Promise<Status> => {
  const data = await execute(port, { code: codes.MSP_STATUS });
  return extractStatus(data);
};

export const readExtendedStatus = async (
  port: string
): Promise<ExtendedStatus> => {
  const data = await execute(port, { code: codes.MSP_STATUS_EX });
  const api = apiVersion(port);
  const status: ExtendedStatus = {
    ...extractStatus(data),
    cpuload: data.readU16(),
    numProfiles: 0,
    rateProfile: 0,
    armingDisabledFlags: [],
  };

  if (semver.gte(api, "1.16.0")) {
    status.numProfiles = data.readU8();
    status.rateProfile = data.readU8();
  }

  if (semver.gte(api, "1.36.0")) {
    // skip all this data for some reason
    times(() => data.readU8(), data.readU8());

    const flags = disarmFlagBits(api);
    // Read arming disable flags
    const numFlags = data.readU8();
    const flagBits = data.readU32();

    // read the enabled disarm flags from the mask
    status.armingDisabledFlags = times(
      (i) => (flagBits & (1 << i)) !== 0 && (flags[i] ?? DisarmFlags.UNKNOWN),
      numFlags
    ).filter((flag): flag is DisarmFlags => typeof flag === "number");
  }
  return status;
};

export const readEnabledFeatures = async (
  port: string
): Promise<Features[]> => {
  const schema = availableFeatures(apiVersion(port));
  const data = await execute(port, { code: codes.MSP_FEATURE_CONFIG });

  const featureMask = data.readU32();
  return Object.entries(schema)
    .filter(([bit]) => (featureMask >> Number(bit)) % 2 !== 0)
    .map(([, feature]) => feature);
};

export const writeEnabledFeatures = async (
  port: string,
  features: Features[]
): Promise<void> => {
  const schema = availableFeatures(apiVersion(port));

  const buffer = new WriteBuffer();
  buffer.push32(
    Object.entries(schema)
      .filter(([, feature]) => features.includes(feature))
      .reduce((acc, [bit]) => acc | (1 << Number(bit)), 0)
  );

  await execute(port, {
    code: codes.MSP_SET_FEATURE_CONFIG,
    data: buffer,
  });
};

export const readRcValues = async (port: string): Promise<number[]> => {
  const data = await execute(port, { code: codes.MSP_RC });
  return new Array(data.byteLength / 2).fill(0).map(() => data.readU16());
};

export const readRCTuning = async (port: string): Promise<RCTuning> => {
  const version = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_RC_TUNING });

  const tuning = {
    rcRate: 0,
    rcExpo: 0,
    rollPitchRate: 0,
    pitchRate: 0,
    rollRate: 0,
    yawRate: 0,
    dynamicThrottlePid: 0,
    throttleMid: 0,
    throttleExpo: 0,
    dynamicThrottleBreakpoint: 0,
    rcYawExpo: 0,
    rcYawRate: 0,
    rcPitchRate: 0,
    rcPitchExpo: 0,
    throttleLimitType: 0,
    throttleLimitPercent: 0,
    rollRateLimit: 0,
    pitchRateLimit: 0,
    yawRateLimit: 0,
  };

  tuning.rcRate = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.rcExpo = parseFloat((data.readU8() / 100).toFixed(2));

  if (semver.lt(version, "1.7.0")) {
    tuning.rollPitchRate = parseFloat((data.readU8() / 100).toFixed(2));
  } else {
    tuning.rollRate = parseFloat((data.readU8() / 100).toFixed(2));
    tuning.pitchRate = parseFloat((data.readU8() / 100).toFixed(2));
  }

  tuning.yawRate = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.dynamicThrottlePid = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.throttleMid = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.throttleExpo = parseFloat((data.readU8() / 100).toFixed(2));
  tuning.dynamicThrottleBreakpoint = semver.gte(version, "1.7.0")
    ? data.readU16()
    : 0;

  if (semver.gte(version, "1.10.0")) {
    tuning.rcYawExpo = parseFloat((data.readU8() / 100).toFixed(2));
    if (semver.gte(version, "1.16.0")) {
      tuning.rcYawRate = parseFloat((data.readU8() / 100).toFixed(2));
    }
  }

  if (semver.gte(version, "1.37.0")) {
    tuning.rcPitchRate = parseFloat((data.readU8() / 100).toFixed(2));
    tuning.rcPitchExpo = parseFloat((data.readU8() / 100).toFixed(2));
  }

  if (semver.gte(version, "1.41.0")) {
    tuning.throttleLimitType = data.readU8();
    tuning.throttleLimitPercent = data.readU8();
  }

  if (semver.gte(version, "1.42.0")) {
    tuning.rollRateLimit = data.readU16();
    tuning.pitchRateLimit = data.readU16();
    tuning.yawRateLimit = data.readU16();
  }

  return tuning;
};

export const readRCDeadband = async (port: string): Promise<RCDeadband> => {
  const data = await execute(port, { code: codes.MSP_RC_DEADBAND });

  return {
    deadband: data.readU8(),
    yawDeadband: data.readU8(),
    altHoldDeadhand: data.readU8(),
    deadband3dThrottle: semver.gte(apiVersion(port), "1.17.0")
      ? data.readU16()
      : 0,
  };
};

export const writeArming = async (
  port: string,
  {
    armingDisabled,
    runawayTakeoffPreventionDisabled,
  }: { armingDisabled: boolean; runawayTakeoffPreventionDisabled: boolean }
): Promise<void> => {
  const data = new WriteBuffer();
  data.push8(Number(armingDisabled));
  data.push8(Number(runawayTakeoffPreventionDisabled));

  await execute(port, { code: codes.MSP_ARMING_DISABLE, data });
};

export const calibrateAccelerometer = async (port: string): Promise<void> => {
  await execute(port, { code: codes.MSP_ACC_CALIBRATION });
  // This command executes on the device, but doesn't actually produce anything
  // for about 2 seconds, so resolve after 2 seconds
  await sleep(2000);
};

export const resetConfig = async (port: string): Promise<void> => {
  await execute(port, { code: codes.MSP_RESET_CONF });
  // This command executes on the device, but doesn't actually produce anything
  // for about 2 seconds, so resolve after 2 seconds
  await sleep(2000);
};

/**
 * Set the device to reboot, returning true if successful
 */
export const reboot = async (
  port: string,
  type?: RebootTypes
): Promise<boolean> => {
  const api = apiVersion(port);
  const data = await execute(port, {
    code: codes.MSP_SET_REBOOT,
    data: type ? ([type] as WriteBuffer) : undefined,
    timeout: 3000,
  }).catch((e) => {
    if (!isOpen(port)) {
      return undefined;
    }
    throw e;
  });

  if (data && semver.gte(api, "1.40.0")) {
    const rebootType = data.read8();
    if (rebootType === RebootTypes.MSC || rebootType === RebootTypes.MSC_UTC) {
      if (data.read8() === 0) {
        return false;
      }
    }
  }

  return true;
};

export const commit = async (port: string): Promise<void> => {
  await execute(port, { code: codes.MSP_EEPROM_WRITE });
};

export const readBoardAlignmentConfig = async (
  port: string
): Promise<Axes3D> => {
  const data = await execute(port, { code: codes.MSP_BOARD_ALIGNMENT_CONFIG });
  return {
    roll: data.read16(),
    pitch: data.read16(),
    yaw: data.read16(),
  };
};

export const writeBoardAlignmentConfig = async (
  port: string,
  { roll, pitch, yaw }: Axes3D
): Promise<void> => {
  await execute(port, {
    code: codes.MSP_SET_BOARD_ALIGNMENT_CONFIG,
    data: new WriteBuffer().push16(roll).push16(pitch).push16(yaw),
  });
};

export const readAdvancedConfig = async (
  port: string
): Promise<AdvancedConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_ADVANCED_CONFIG });
  const config: AdvancedConfig = {
    gyroSyncDenom: 0,
    pidProcessDenom: 0,
    useUnsyncedPwm: false,
    fastPwmProtocol: 0,
    gyroToUse: 0,
    motorPwmRate: 0,
    digitalIdlePercent: 0,
    gyroUse32kHz: false,
    motorPwmInversion: 0,
    gyroHighFsr: 0,
    gyroMovementCalibThreshold: 0,
    gyroCalibDuration: 0,
    gyroOffsetYaw: 0,
    gyroCheckOverflow: 0,
    debugMode: 0,
    debugModeCount: 0,
  };

  config.gyroSyncDenom = data.readU8();
  config.pidProcessDenom = data.readU8();
  config.useUnsyncedPwm = data.readU8() !== 0;
  config.fastPwmProtocol = toIdentifier(escProtocols(api), data.readU8());
  config.motorPwmRate = data.readU16();
  if (semver.gte(api, "1.24.0")) {
    config.digitalIdlePercent = data.readU16() / 100;
  }

  if (semver.gte(api, "1.25.0")) {
    const gyroUse32kHz = data.readU8();

    if (semver.lt(api, "1.41.0")) {
      config.gyroUse32kHz = gyroUse32kHz !== 0;
    }
  }

  if (semver.gte(api, "1.42.0")) {
    config.motorPwmInversion = data.readU8();
    // gyroToUse (read by MSP_SENSOR_ALIGNMENT)
    config.gyroToUse = data.readU8();
    config.gyroHighFsr = data.readU8();
    config.gyroMovementCalibThreshold = data.readU8();
    config.gyroCalibDuration = data.readU16();
    config.gyroOffsetYaw = data.readU16();
    config.gyroCheckOverflow = data.readU8();
    config.debugMode = data.readU8();
    config.debugModeCount = data.readU8();
  }

  return config;
};

export const writeAdvancedConfig = async (
  port: string,
  config: AdvancedConfig
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();
  buffer
    .push8(config.gyroSyncDenom)
    .push8(config.pidProcessDenom)
    .push8(config.useUnsyncedPwm ? 1 : 0)
    .push8(
      fromIdentifier(escProtocols(api), config.fastPwmProtocol) ??
        config.fastPwmProtocol
    )
    .push16(config.motorPwmRate);
  if (semver.gte(api, "1.24.0")) {
    buffer.push16(config.digitalIdlePercent * 100);
  }

  if (semver.gte(api, "1.25.0")) {
    let gyroUse32kHz = 0;
    if (semver.lt(api, "1.41.0")) {
      gyroUse32kHz = config.gyroUse32kHz ? 1 : 0;
    }
    buffer.push8(gyroUse32kHz);
  }

  if (semver.gte(api, "1.42.0")) {
    buffer
      .push8(config.motorPwmInversion)
      .push8(config.gyroToUse)
      .push8(config.gyroHighFsr)
      .push8(config.gyroMovementCalibThreshold)
      .push16(config.gyroCalibDuration)
      .push16(config.gyroOffsetYaw)
      .push8(config.gyroCheckOverflow)
      .push8(config.debugMode);
  }
  await execute(port, { code: codes.MSP_SET_ADVANCED_CONFIG, data: buffer });
};

export const writePartialAdvancedConfig = partialWriteFunc(
  readAdvancedConfig,
  writeAdvancedConfig
);

const ALLOWED_DSHOT_CONDITIONS = [Beepers.RX_SET, Beepers.RX_LOST];

export const readBeeperConfig = async (port: string): Promise<BeeperConfig> => {
  const data = await execute(port, { code: codes.MSP_BEEPER_CONFIG });
  const api = apiVersion(port);
  const beeperSchema = beeperBits(api);
  return {
    // For some reason, the flag bits are actually inverted for both
    // read and write
    conditions: unpackValues(data.readU32(), beeperSchema, { inverted: true }),
    dshot: {
      tone: semver.gte(api, "1.37.0") ? data.readU8() : 0,
      conditions: semver.gte(api, "1.39.0")
        ? (unpackValues(data.readU32(), beeperSchema, {
            inverted: true,
          }).filter((beeper) => ALLOWED_DSHOT_CONDITIONS.includes(beeper)) as (
            | Beepers.RX_SET
            | Beepers.RX_LOST
          )[])
        : [],
    },
  };
};

export const writeBeeperConfig = async (
  port: string,
  config: BeeperConfig
): Promise<void> => {
  const api = apiVersion(port);
  const beeperSchema = beeperBits(api);
  const buffer = new WriteBuffer();

  buffer.push32(
    packValues(config.conditions, beeperSchema, {
      inverted: true,
    })
  );

  if (semver.gte(api, "1.37.0")) {
    buffer.push8(config.dshot.tone);
  }

  if (semver.gte(api, "1.39.0")) {
    buffer.push32(
      packValues(
        config.dshot.conditions.filter((con) =>
          ALLOWED_DSHOT_CONDITIONS.includes(con)
        ),
        beeperSchema,
        { inverted: true }
      )
    );
  }

  await execute(port, { code: codes.MSP_SET_BEEPER_CONFIG, data: buffer });
};

export const writePartialBeeperConfig = partialWriteFunc(
  readBeeperConfig,
  writeBeeperConfig
);

export const readDisabledSensors = async (port: string): Promise<Sensors[]> => {
  const data = await execute(port, { code: codes.MSP_SENSOR_CONFIG });
  const schema = sensorBits();
  const disabled: Sensors[] = [];
  schema.forEach((sensor) => {
    if (data.remaining() > 0 && data.read8() === 1) {
      disabled.push(sensor);
    }
  });

  return disabled;
};

export const writeDisabledSensors = async (
  port: string,
  disabledSensors: Sensors[]
): Promise<void> => {
  const buffer = new WriteBuffer();
  [Sensors.ACCELEROMETER, Sensors.BAROMETER, Sensors.MAGNETOMETER].forEach(
    (sensor) => {
      buffer.push8(disabledSensors.includes(sensor) ? 1 : 0);
    }
  );
  await execute(port, { code: codes.MSP_SET_SENSOR_CONFIG, data: buffer });
};

export const readRxConfig = async (port: string): Promise<RxConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_RX_CONFIG });

  const initial = {
    serialProvider: toIdentifier(serialRxProviders(api), data.readU8()),
    stick: {
      max: data.readU16(),
      center: data.readU16(),
      min: data.readU16(),
    },
    spektrumSatBind: data.readU8(),
    rxMinUsec: data.readU16(),
    rxMaxUsec: data.readU16(),
    ...(semver.gte(api, "1.20.0")
      ? {
          interpolation: toIdentifier(rcInterpolations(), data.readU8()),
          interpolationInterval: data.readU8(),
          airModeActivateThreshold: data.readU16(),
        }
      : {
          interpolation: RcInterpolations.AUTO,
          interpolationInterval: 0,
          airModeActivateThreshold: 0,
        }),
    ...(semver.gte(api, "1.31.0")
      ? {
          spi: {
            protocol: toIdentifier(
              spiRxProtocols(api),
              data.readU8()
            ) as SpiRxProtocols,
            id: data.readU32(),
            rfChannelCount: data.readU8(),
          },
          fpvCamAngleDegrees: data.readU8(),
        }
      : {
          spi: {
            protocol: SpiRxProtocols.NRF24_V202_250K,
            id: 0,
            rfChannelCount: 0,
          },
          fpvCamAngleDegrees: 0,
        }),
  };
  const smoothing = semver.gte(api, "1.40.0")
    ? {
        channels: toIdentifier(rcSmoothingChannels(), data.readU8()),
        type: toIdentifier(rcSmoothingTypes(), data.readU8()),
        inputCutoff: data.readU8(),
        derivativeCutoff: data.readU8(),
        inputType: toIdentifier(rcSmoothingInputTypes(), data.readU8()),
        derivativeType: toIdentifier(
          rcSmoothingDerivativeTypes(api),
          data.readU8()
        ),
      }
    : {
        channels: RcSmoothingChannels.RP,
        type: RcSmoothingTypes.INTERPOLATION,
        inputCutoff: 0,
        derivativeCutoff: 0,
        inputType: RcSmoothingInputTypes.PT1,
        derivativeType: RcSmoothingDerivativeTypes.AUTO,
      };

  return {
    ...initial,
    ...(semver.gte(api, "1.42.0")
      ? { usbCdcHidType: data.readU8() }
      : { usbCdcHidType: 0 }),
    rcSmoothing: {
      ...smoothing,
      ...(semver.gte(api, "1.42.0")
        ? {
            autoSmoothness: data.readU8(),
          }
        : { autoSmoothness: 0 }),
    },
  };
};

export const writeRxConfig = async (
  port: string,
  config: RxConfig
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();

  buffer
    .push8(
      fromIdentifier(serialRxProviders(api), config.serialProvider) ??
        config.serialProvider
    )
    .push16(config.stick.max)
    .push16(config.stick.center)
    .push16(config.stick.center)
    .push8(config.spektrumSatBind)
    .push16(config.rxMinUsec)
    .push16(config.rxMaxUsec);
  if (semver.gte(api, "1.20.0")) {
    buffer
      .push8(
        fromIdentifier(rcInterpolations(), config.interpolation) ??
          config.interpolation
      )
      .push8(config.interpolationInterval)
      .push16(config.airModeActivateThreshold);
  }
  if (semver.gte(api, "1.31.0")) {
    buffer
      .push8(
        fromIdentifier(spiRxProtocols(api), config.spi.protocol) ??
          config.spi.protocol
      )
      .push32(config.spi.id)
      .push8(config.spi.rfChannelCount)
      .push8(config.fpvCamAngleDegrees);
  }

  if (semver.gte(api, "1.40.0")) {
    buffer
      .push8(
        fromIdentifier(rcSmoothingChannels(), config.rcSmoothing.channels) ??
          config.rcSmoothing.channels
      )
      .push8(
        fromIdentifier(rcSmoothingTypes(), config.rcSmoothing.type) ??
          config.rcSmoothing.type
      )
      .push8(config.rcSmoothing.inputCutoff)
      .push8(config.rcSmoothing.derivativeCutoff)
      .push8(
        fromIdentifier(rcSmoothingInputTypes(), config.rcSmoothing.inputType) ??
          config.rcSmoothing.inputType
      )
      .push8(
        fromIdentifier(
          rcSmoothingDerivativeTypes(api),
          config.rcSmoothing.derivativeType
        ) ?? config.rcSmoothing.derivativeType
      );
  }

  if (semver.gte(api, "1.42.0")) {
    buffer.push8(config.usbCdcHidType).push8(config.rcSmoothing.autoSmoothness);
  }

  await execute(port, { code: codes.MSP_SET_RX_CONFIG, data: buffer });
};

export const writePartialRxConfig = partialWriteFunc(
  readRxConfig,
  writeRxConfig
);

export const readRxMap = async (port: string): Promise<ChannelMap> => {
  const data = await execute(port, { code: codes.MSP_RX_MAP });
  const schema = channelLetters();
  const map = new Array(8).fill("A") as ChannelMap;
  schema.forEach((letter) => {
    map[data.readU8()] = letter;
  });
  return map;
};

export const writeRxMap = async (
  port: string,
  map: ChannelMap
): Promise<void> => {
  const buffer = new WriteBuffer();
  const schema = channelLetters();
  schema.forEach((letter) => {
    const value = typeof letter !== "number" ? map.indexOf(letter) : letter;
    buffer.push8(value);
  });

  await execute(port, { code: codes.MSP_SET_RX_MAP, data: buffer });
};

export const readRssiConfig = async (port: string): Promise<RssiConfig> => {
  const data = await execute(port, { code: codes.MSP_RSSI_CONFIG });

  return {
    channel: data.readU8(),
  };
};

export const writeRssiConfig = async (
  port: string,
  config: RssiConfig
): Promise<void> => {
  const buffer = new WriteBuffer();

  buffer.push8(config.channel);

  await execute(port, { code: codes.MSP_SET_RSSI_CONFIG, data: buffer });
};

export const readGpsConfig = async (port: string): Promise<GpsConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_GPS_CONFIG });

  // gps not enabled, not exactly good api from the FC
  if (data.byteLength === 0) {
    return {
      provider: GpsProtocols.NMEA,
      ubloxSbas: GpsSbasTypes.AUTO,
      autoConfig: false,
      autoBaud: false,
      homePointOnce: false,
      ubloxUseGalileo: false,
    };
  }

  return {
    provider: toIdentifier(gpsProtocols(api), data.readU8()),
    ubloxSbas: data.readU8(),
    autoConfig: semver.gte(api, "1.34.0") ? data.readU8() === 1 : false,
    autoBaud: semver.gte(api, "1.34.0") ? data.readU8() === 1 : false,
    homePointOnce: semver.gte(api, "1.43.0") ? data.readU8() === 1 : false,
    ubloxUseGalileo: semver.gte(api, "1.43.0") ? data.readU8() === 1 : false,
  };
};

export const writeGpsConfig = async (
  port: string,
  config: GpsConfig
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();
  buffer
    .push8(
      fromIdentifier(gpsProtocols(api), config.provider) ?? config.provider
    )
    .push8(config.ubloxSbas);
  if (semver.gte(api, "1.34.0")) {
    buffer.push8(config.autoConfig ? 1 : 0).push8(config.autoBaud ? 1 : 0);
  }

  if (semver.gte(api, "1.43.0")) {
    buffer
      .push8(config.homePointOnce ? 1 : 0)
      .push8(config.ubloxUseGalileo ? 1 : 0);
  }

  await execute(port, { code: codes.MSP_SET_GPS_CONFIG, data: buffer });
};

export const readBlackboxConfig = async (
  port: string
): Promise<BlackboxConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_BLACKBOX_CONFIG });
  return {
    supported: (data.readU8() & 1) !== 0,
    device: toIdentifier(blackboxDevices(api), data.readU8()),
    rateNum: data.readU8(),
    rateDenom: data.readU8(),
    pDenom: semver.gte(api, "1.36.0") ? data.readU16() : 0,
    sampleRate: semver.gte(api, "1.44.0") ? data.readU8() : 0,
  };
};

export const writeBlackboxConfig = async (
  port: string,
  config: Omit<BlackboxConfig, "supported">
): Promise<void> => {
  const api = apiVersion(port);
  const buffer = new WriteBuffer();

  buffer
    .push8(fromIdentifier(blackboxDevices(api), config.device) ?? config.device)
    .push8(config.rateNum)
    .push8(config.rateDenom);
  if (semver.gte(api, "1.36.0")) {
    buffer.push16(config.pDenom);
  }
  if (semver.gte(api, "1.44.0")) {
    buffer.push8(config.sampleRate);
  }

  await execute(port, { code: codes.MSP_SET_BLACKBOX_CONFIG, data: buffer });
};

export const writePartialBlackboxConfig = partialWriteFunc(
  readBlackboxConfig,
  writeBlackboxConfig
);

/**
 * Return the base 64 encoded result of the blackbox config
 */
export const readDataFlashChunk = async (
  port: string,
  address: number,
  blockSize: number
): Promise<Buffer> => {
  const api = apiVersion(port);

  const args = new WriteBuffer();
  args.push32(address);
  if (semver.gte(api, "1.31.0")) {
    args.push16(blockSize);
  }

  if (semver.gte(api, "1.36.0")) {
    args.push8(1);
  }

  const data = await execute(port, {
    code: codes.MSP_DATAFLASH_READ,
    data: args,
    timeout: 1000,
    match: (response) => response.readU32() === address,
  });

  // ignore the address as this was
  // checked by the executor
  data.readU32();

  const headerSize = semver.gte(api, "1.31.0") ? 7 : 4;
  const dataSize = semver.gte(api, "1.31.0")
    ? data.readU16()
    : data.buffer.byteLength - headerSize;
  const compressed = semver.gte(api, "1.31.0") && data.readU8() === 1;

  /* Strip that address off the front of the reply and deliver it separately so the caller doesn't have to
   * figure out the reply format:
   */
  if (!compressed) {
    return Buffer.from(
      new Uint8Array(data.buffer, data.byteOffset + headerSize, dataSize)
    );
  }
  // Read compressed char count to avoid decoding stray bit sequences as bytes
  const compressedCharCount = data.readU16();

  // Compressed format uses 2 additional bytes as a pseudo-header to denote the number of uncompressed bytes
  const compressedArray = Buffer.from(
    new Uint8Array(data.buffer, data.byteOffset + headerSize + 2, dataSize - 2)
  );

  const decompressedArray = huffmanDecodeBuffer(
    compressedArray,
    compressedCharCount
  );

  return decompressedArray;
};

export const readDataFlashSummary = async (
  port: string
): Promise<DataFlashSummary> => {
  const data = await execute(port, { code: codes.MSP_DATAFLASH_SUMMARY });
  if (data.byteLength >= 13) {
    const flags = data.readU8();
    return {
      ready: (flags & 1) !== 0,
      supported: (flags & 2) !== 0,
      sectors: data.readU32(),
      totalSize: data.readU32(),
      usedSize: data.readU32(),
    };
  }
  // Firmware version too old to support MSP_DATAFLASH_SUMMARY
  return {
    ready: false,
    supported: false,
    sectors: 0,
    totalSize: 0,
    usedSize: 0,
  };
};

export const readSdCardSummary = async (
  port: string
): Promise<SdCardSummary> => {
  const data = await execute(port, { code: codes.MSP_SDCARD_SUMMARY });
  const flags = data.readU8();
  return {
    supported: (flags & 0x01) !== 0,
    state: data.readU8(),
    filesystemLastError: data.readU8(),
    freeSizeKB: data.readU32(),
    totalSizeKB: data.readU32(),
  };
};

export const eraseDataFlash = async (port: string): Promise<void> => {
  await execute(port, { code: codes.MSP_DATAFLASH_ERASE });
};
