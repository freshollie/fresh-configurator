/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Hacky mock data generator to be able to test this API without
 * a device
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Sensors,
  DisarmFlags,
  SerialPortFunctions,
  Axes3D,
  Beepers,
  mergeDeep,
  RcInterpolations,
  RcSmoothingDerivativeTypes,
  RcSmoothingInputTypes,
  RcSmoothingTypes,
  SpiRxProtocols,
  SerialRxProviders,
  Features,
  ChannelMap,
  Modes,
  BlackboxDevices,
  SdCardStates,
  TargetCapabilities,
} from "@betaflight/api";
import * as api from "@betaflight/api";
import { v4 } from "uuid";

import * as connections from "../connections";

export * from "@betaflight/api";

const badPort = "/dev/somebadport";
const legacyPort = "/dev/legacy-device";
const autoClosePort = "/dev/auto-close";
const mockPorts = [
  "/dev/somemockport",
  "/dev/anothermock",
  badPort,
  legacyPort,
  autoClosePort,
];

const ids = Object.fromEntries(mockPorts.map((port) => [port, v4()]));

const badBaudrate = 38400;

let mockDevice = {
  name: "mock-device",
  variant: "BTFL",
  attitude: {
    roll: 0,
    pitch: 0,
    yaw: 0,
  },
  alignment: {
    roll: 0,
    pitch: 0,
    yaw: 0,
  },
  gps: {
    fix: false,
    numSat: 5,
    lat: -1,
    lon: -1,
    alt: -1,
    speed: -1,
    groundCourse: -1,
  },
  status: {
    armingDisabledFlags: [] as DisarmFlags[],
    cycleTime: 0,
    i2cError: 0,
    sensors: [Sensors.ACCELEROMETER, Sensors.GYRO, Sensors.GPS, Sensors.SONAR],
    mode: 0,
    profile: 0,
    cpuload: 0,
    numProfiles: 1,
    rateProfile: 1,
  },
  analogValues: {
    voltage: 0,
    mahDrawn: 0,
    rssi: 0,
    amperage: 0,
  },
  channels: new Array(16).fill(0),
  serial: {
    ports: [
      {
        id: 0,
        functions: [SerialPortFunctions.MSP],
        mspBaudRate: 115200,
        gpsBaudRate: -1,
        telemetryBaudRate: -1,
        blackboxBaudRate: -1,
      },
      {
        id: 1,
        functions: [SerialPortFunctions.GPS],
        mspBaudRate: -1,
        gpsBaudRate: 115200,
        telemetryBaudRate: -1,
        blackboxBaudRate: -1,
      },
      {
        id: 2,
        functions: [SerialPortFunctions.RX_SERIAL],
        mspBaudRate: -1,
        gpsBaudRate: -1,
        telemetryBaudRate: -1,
        blackboxBaudRate: -1,
      },
    ],
  },
  advancedConfig: {
    gyroSyncDenom: 3,
    pidProcessDenom: 2,
    useUnsyncedPwm: false,
    fastPwmProtocol: 1,
    gyroToUse: 0,
    motorPwmRate: 480,
    digitalIdlePercent: 4.5,
    gyroUse32kHz: false,
    motorPwmInversion: 0,
    gyroHighFsr: 0,
    gyroMovementCalibThreshold: 0,
    gyroCalibDuration: 0,
    gyroOffsetYaw: 0,
    gyroCheckOverflow: 0,
    debugMode: 0,
    debugModeCount: 0,
  },
  boardInfo: {
    boardIdentifier: "S411",
    boardName: "CRAZYBEEF4FS",
    boardType: 2,
    boardVersion: 0,
    configurationState: 2,
    manufacturerId: "HAMO",
    mcuTypeId: 4,
    sampleRateHz: undefined,
    signature: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    targetCapabilities: [
      TargetCapabilities.HAS_SOFTSERIAL,
      TargetCapabilities.HAS_VCP,
    ],
    targetName: "STM32F411",
  },
  mixerConfig: {
    mixer: 3,
    reversedMotors: false,
  },
  beeper: {
    conditions: [] as Beepers[],
    dshot: {
      tone: 0,
      conditions: [Beepers.RX_LOST] as (Beepers.RX_LOST | Beepers.RX_SET)[],
    },
  },
  disabledSensors: [Sensors.MAGNETOMETER],
  rxConfig: {
    airModeActivateThreshold: 1320,
    fpvCamAngleDegrees: 0,
    interpolation: RcInterpolations.MANUAL,
    interpolationInterval: 19,
    rcSmoothing: {
      autoSmoothness: 0,
      channels: 2,
      derivativeCutoff: 0,
      derivativeType: RcSmoothingDerivativeTypes.BIQUAD,
      inputCutoff: 0,
      inputType: RcSmoothingInputTypes.BIQUAD,
      type: RcSmoothingTypes.INTERPOLATION,
    },
    rxMaxUsec: 2115,
    rxMinUsec: 885,
    spi: {
      id: 0,
      protocol: SpiRxProtocols.NRF24_V202_250K,
      rfChannelCount: 0,
    },
    serialProvider: SerialRxProviders.SPEKTRUM1024,
    spektrumSatBind: 0,
    stick: {
      center: 1500,
      max: 1900,
      min: 1050,
    },
    usbCdcHidType: 0,
  },
  features: [Features.RX_SERIAL, Features.OSD, Features.SOFTSERIAL],
  rcTuning: {
    dynamicThrottleBreakpoint: 1500,
    dynamicThrottlePid: 0.05,
    pitchRate: 0.05,
    pitchRateLimit: 1500,
    rcExpo: 0.05,
    rcPitchExpo: 0.06,
    rcPitchRate: 1.39,
    rcRate: 2.2,
    rcYawExpo: 2.2,
    rcYawRate: 0.05,
    rollPitchRate: 0,
    rollRate: 2.2,
    rollRateLimit: 1500,
    throttleExpo: 0.03,
    throttleLimitPercent: 5,
    throttleLimitType: 220,
    throttleMid: 1.17,
    yawRate: 2.2,
    yawRateLimit: 1500,
  },
  rcDeadband: {
    deadband: 0,
    yawDeadband: 0,
    altHoldDeadhand: 0,
    deadband3dThrottle: 0,
  },
  rxMap: ["A", "E", "T", "R", "1", "2", "3", "4"] as ChannelMap,
  rssi: {
    channel: 0,
  },
  modeRangeSlots: [
    { modeId: 0, auxChannel: 3, range: { start: 1300, end: 1700 } },
    { modeId: 0, auxChannel: 3, range: { start: 1300, end: 900 } },
    {
      modeId: Modes.ANGLE,
      auxChannel: 5,
      range: { start: 950, end: 1350 },
    },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
  ],
  blackboxConfig: {
    supported: true,
    device: BlackboxDevices.FLASH,
    rateNum: 1,
    rateDenom: 1,
    pDenom: 32,
    sampleRate: 0,
  },
  blackboxDataFlashSummary: {
    ready: true,
    supported: true,
    sectors: 128,
    totalSize: 8388608,
    usedSize: 2561024,
  },
  blackboxSdCardSummary: {
    supported: true,
    state: SdCardStates.NOT_PRESENT,
    filesystemLastError: 0,
    freeSizeKB: 167772160,
    totalSizeKB: 335545600,
  },
  vtxConfig: {
    type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
    band: 5,
    channel: 0,
    power: 0,
    pitMode: true,
    frequency: 0,
    deviceReady: false,
    lowPowerDisarm: 0,
    pitModeFrequency: 0,
    table: {
      available: true,
      numBands: 2,
      bands: [
        {
          rowNumber: 1,
          isFactoryBand: true,
          letter: "A",
          name: "Band A",
          frequencies: [1, 2, 3],
        },
        {
          rowNumber: 2,
          isFactoryBand: true,
          letter: "B",
          name: "Band B",
          frequencies: [5, 6, 7],
        },
      ],
      powerLevels: [
        { rowNumber: 1, label: "Label 1", value: 1 },
        { rowNumber: 2, label: "Label 2", value: 2 },
      ],
      numBandChannels: 3,
      numPowerLevels: 2,
    },
  },
};

const reset = () => {
  mockDevice = {
    name: "mock-device",
    variant: "BTFL",
    attitude: {
      roll: 0,
      pitch: 0,
      yaw: 0,
    },
    alignment: {
      roll: 0,
      pitch: 0,
      yaw: 0,
    },
    gps: {
      fix: false,
      numSat: 5,
      lat: -1,
      lon: -1,
      alt: -1,
      speed: -1,
      groundCourse: -1,
    },
    status: {
      armingDisabledFlags: [] as DisarmFlags[],
      cycleTime: 0,
      i2cError: 0,
      sensors: [
        Sensors.ACCELEROMETER,
        Sensors.GYRO,
        Sensors.GPS,
        Sensors.SONAR,
      ],
      mode: 0,
      profile: 0,
      cpuload: 0,
      numProfiles: 1,
      rateProfile: 1,
    },
    analogValues: {
      voltage: 0,
      mahDrawn: 0,
      rssi: 0,
      amperage: 0,
    },
    channels: new Array(16).fill(0),
    serial: {
      ports: [
        {
          id: 0,
          functions: [SerialPortFunctions.MSP],
          mspBaudRate: 115200,
          gpsBaudRate: -1,
          telemetryBaudRate: -1,
          blackboxBaudRate: -1,
        },
        {
          id: 1,
          functions: [SerialPortFunctions.GPS],
          mspBaudRate: -1,
          gpsBaudRate: 115200,
          telemetryBaudRate: -1,
          blackboxBaudRate: -1,
        },
        {
          id: 2,
          functions: [SerialPortFunctions.RX_SERIAL],
          mspBaudRate: -1,
          gpsBaudRate: -1,
          telemetryBaudRate: -1,
          blackboxBaudRate: -1,
        },
      ],
    },
    advancedConfig: {
      gyroSyncDenom: 3,
      pidProcessDenom: 2,
      useUnsyncedPwm: false,
      fastPwmProtocol: 1,
      gyroToUse: 0,
      motorPwmRate: 480,
      digitalIdlePercent: 4.5,
      gyroUse32kHz: false,
      motorPwmInversion: 0,
      gyroHighFsr: 0,
      gyroMovementCalibThreshold: 0,
      gyroCalibDuration: 0,
      gyroOffsetYaw: 0,
      gyroCheckOverflow: 0,
      debugMode: 0,
      debugModeCount: 0,
    },
    boardInfo: {
      boardIdentifier: "S411",
      boardName: "CRAZYBEEF4FS",
      boardType: 2,
      boardVersion: 0,
      configurationState: 2,
      manufacturerId: "HAMO",
      mcuTypeId: 4,
      sampleRateHz: undefined,
      signature: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      targetCapabilities: [
        TargetCapabilities.IS_UNIFIED,
        TargetCapabilities.SUPPORTS_RX_BIND,
      ],
      targetName: "STM32F411",
    },
    mixerConfig: {
      mixer: 3,
      reversedMotors: false,
    },
    beeper: {
      conditions: [] as Beepers[],
      dshot: {
        tone: 0,
        conditions: [Beepers.RX_LOST] as (Beepers.RX_LOST | Beepers.RX_SET)[],
      },
    },
    disabledSensors: [Sensors.MAGNETOMETER],
    rxConfig: {
      airModeActivateThreshold: 1320,
      fpvCamAngleDegrees: 0,
      interpolation: RcInterpolations.MANUAL,
      interpolationInterval: 19,
      rcSmoothing: {
        autoSmoothness: 0,
        channels: 2,
        derivativeCutoff: 0,
        derivativeType: RcSmoothingDerivativeTypes.BIQUAD,
        inputCutoff: 0,
        inputType: RcSmoothingInputTypes.BIQUAD,
        type: RcSmoothingTypes.INTERPOLATION,
      },
      rxMaxUsec: 2115,
      rxMinUsec: 885,
      spi: {
        id: 0,
        protocol: SpiRxProtocols.NRF24_V202_250K,
        rfChannelCount: 0,
      },
      serialProvider: SerialRxProviders.SPEKTRUM1024,
      spektrumSatBind: 0,
      stick: {
        center: 1500,
        max: 1900,
        min: 1050,
      },
      usbCdcHidType: 0,
    },
    features: [Features.RX_SERIAL, Features.OSD, Features.SOFTSERIAL],
    rcTuning: {
      dynamicThrottleBreakpoint: 1500,
      dynamicThrottlePid: 0.05,
      pitchRate: 0.05,
      pitchRateLimit: 1500,
      rcExpo: 0.05,
      rcPitchExpo: 0.06,
      rcPitchRate: 1.39,
      rcRate: 2.2,
      rcYawExpo: 2.2,
      rcYawRate: 0.05,
      rollPitchRate: 0,
      rollRate: 2.2,
      rollRateLimit: 1500,
      throttleExpo: 0.03,
      throttleLimitPercent: 5,
      throttleLimitType: 220,
      throttleMid: 1.17,
      yawRate: 2.2,
      yawRateLimit: 1500,
    },
    rcDeadband: {
      deadband: 0,
      yawDeadband: 0,
      altHoldDeadhand: 0,
      deadband3dThrottle: 0,
    },
    rxMap: ["A", "E", "T", "R", "1", "2", "3", "4"] as ChannelMap,
    rssi: {
      channel: 0,
    },
    modeRangeSlots: [
      { modeId: 0, auxChannel: 3, range: { start: 1300, end: 1700 } },
      { modeId: 0, auxChannel: 3, range: { start: 1300, end: 900 } },
      {
        modeId: Modes.ANGLE,
        auxChannel: 5,
        range: { start: 950, end: 1350 },
      },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
      { modeId: 0, auxChannel: 0, range: { start: 900, end: 900 } },
    ],
    blackboxConfig: {
      supported: true,
      device: BlackboxDevices.FLASH,
      rateNum: 1,
      rateDenom: 1,
      pDenom: 32,
      sampleRate: 0,
    },
    blackboxDataFlashSummary: {
      ready: true,
      supported: true,
      sectors: 128,
      totalSize: 8388608,
      usedSize: 2561024,
    },
    blackboxSdCardSummary: {
      supported: true,
      state: SdCardStates.NOT_PRESENT,
      filesystemLastError: 0,
      freeSizeKB: 167772160,
      totalSizeKB: 335545600,
    },
    vtxConfig: {
      type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
      band: 5,
      channel: 0,
      power: 0,
      pitMode: true,
      frequency: 0,
      deviceReady: false,
      lowPowerDisarm: 0,
      pitModeFrequency: 0,
      table: {
        available: true,
        numBands: 2,
        bands: [
          {
            rowNumber: 1,
            isFactoryBand: true,
            letter: "A",
            name: "Band A",
            frequencies: [1, 2, 3],
          },
          {
            rowNumber: 2,
            isFactoryBand: true,
            letter: "B",
            name: "Band B",
            frequencies: [5, 6, 7],
          },
        ],
        powerLevels: [
          { rowNumber: 1, label: "Label 1", value: 1 },
          { rowNumber: 2, label: "Label 2", value: 2 },
        ],
        numBandChannels: 3,
        numPowerLevels: 2,
      },
    },
  };
};

const tickAttitude = (): void => {
  const newValue = (mockDevice.attitude.roll + 1) % 360;
  mockDevice.attitude.roll = newValue;
  mockDevice.attitude.pitch = newValue;
  mockDevice.attitude.yaw = newValue;
};

const tickGps = (): void => {
  mockDevice.gps.fix = Math.random() * 100 !== 0;
  mockDevice.gps.numSat = Math.round(Math.random() * 10);
  mockDevice.gps.lat = mockDevice.gps.fix ? Math.random() * 10000 : -1;
  mockDevice.gps.lon = mockDevice.gps.fix ? Math.random() * 10000 : -1;
  mockDevice.gps.alt = mockDevice.gps.fix ? Math.random() * 2000 : -1;
  mockDevice.gps.alt = mockDevice.gps.fix ? Math.random() * 100 : -1;
  mockDevice.gps.alt = mockDevice.gps.fix ? Math.random() * 360 : -1;
};

const tickStatus = (): void => {
  const baseFlags = [DisarmFlags.FAILSAFE, DisarmFlags.ARM_SWITCH];
  mockDevice.status.armingDisabledFlags =
    mockDevice.attitude.roll > 0
      ? baseFlags.concat([DisarmFlags.ANGLE])
      : baseFlags;
  mockDevice.status.i2cError += Math.round(Math.random());
  mockDevice.status.cpuload = Math.round(Math.random() * 100);
  mockDevice.status.cycleTime = Math.round(Math.random() * 300);
};

const tickAnalogValues = (): void => {
  mockDevice.analogValues.amperage = Math.round(Math.random() * 10);
  mockDevice.analogValues.mahDrawn += Math.round(Math.random() * 10);
  mockDevice.analogValues.rssi = Math.round(Math.random() * 100);
  mockDevice.analogValues.voltage = Math.round(Math.random() * 5 * 100) / 100;
};

const tickChannels = (): void => {
  mockDevice.channels = mockDevice.channels.map((v, i) => (v + i + 1) % 2200);
};

export const startTicks = (): void => {
  setInterval(tickAttitude, 1000 / 120);
  setInterval(tickStatus, 1000 / 60);
  setInterval(tickAnalogValues, 1000 / 30);
  setInterval(tickGps, 1000 / 0.2);
  setInterval(tickChannels, 1000 / 120);
};

const delay = (ms?: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ports: typeof api.ports = () =>
  delay(10).then(() => mockPorts.map((port) => ({ path: port })));
export const isOpen: typeof api.isOpen = (port) => !!connections.forPort(port);
export const close: typeof api.close = (port) =>
  delay(10).then(() => undefined);

type OnClose = () => void;
export const open = async (
  port: string,
  optionsOrOnClose?: { baudRate?: number } | OnClose,
  onCloseCallback = () => {}
): Promise<void> => {
  await delay(port === badPort ? 1000 : 100);

  let baudRate = 115200;
  let onClose = onCloseCallback;
  if (optionsOrOnClose) {
    if (typeof optionsOrOnClose !== "function") {
      baudRate = optionsOrOnClose.baudRate ?? 115200;
    } else {
      onClose = optionsOrOnClose;
    }
  }

  if (port === badPort || baudRate === badBaudrate) {
    throw new Error("Could not determine MSP version");
  }

  if (port === autoClosePort) {
    setTimeout(onClose, 10000);
  }
};

export const apiVersion = (port: string): string =>
  port === legacyPort ? "1.0.0" : "1.41.0";

export const readAttitude = (
  port: string
): Promise<typeof mockDevice["attitude"]> =>
  delay(10).then(() => mockDevice.attitude);

export const readRawGPS = (port: string): Promise<typeof mockDevice["gps"]> =>
  delay(5).then(() => mockDevice.gps);

export const writeArming = (port: string): Promise<void> => delay(50);

export const readExtendedStatus = (
  port: string
): Promise<typeof mockDevice["status"]> =>
  delay(10).then(() => mockDevice.status);

export const readAnalogValues = (
  port: string
): Promise<typeof mockDevice["analogValues"]> =>
  delay(10).then(() => mockDevice.analogValues);

export const readRcValues = (port: string): Promise<number[]> =>
  delay(10).then(() => mockDevice.channels);

export const readSerialConfig = (
  port: string
): Promise<typeof mockDevice["serial"]> =>
  delay(50).then(() => mockDevice.serial);

export const writeSerialConfig: typeof api.writeSerialConfig = (
  port,
  config
): Promise<void> =>
  delay(50).then(() => {
    mockDevice.serial = config;
  });

export const readUID = (port: string): Promise<string> =>
  delay(30).then(() => {
    const id = ids[port];
    if (id) {
      return id;
    }
    throw new Error("Port does not exist");
  });

export const reboot = (port: string): Promise<boolean> =>
  delay(100).then(() => true);

export const readBoardAlignmentConfig = (port: string): Promise<Axes3D> =>
  delay(20).then(() => mockDevice.alignment);

export const writeBoardAlignmentConfig = (
  port: string,
  alignment: Axes3D
): Promise<void> =>
  delay(20).then(() => {
    mockDevice.alignment = alignment;
  });

export const readAdvancedConfig = (port: string) =>
  delay(30).then(() => mockDevice.advancedConfig);

export const readBoardInfo = (port: string) =>
  delay(10).then(() => mockDevice.boardInfo);

export const readMixerConfig = (port: string) =>
  delay(15).then(() => mockDevice.mixerConfig);

export const writePartialMixerConfig: typeof api.writePartialMixerConfig = (
  port,
  config
) =>
  delay(50).then(() => {
    mockDevice.mixerConfig = mergeDeep(mockDevice.mixerConfig, config);
  });

export const writePartialAdvancedConfig: typeof api.writePartialAdvancedConfig =
  (port, config) =>
    delay(10).then(() => {
      mockDevice.advancedConfig = mergeDeep(mockDevice.advancedConfig, config);
    });

export const readBeeperConfig = (port: string) =>
  delay(20).then(() => mockDevice.beeper);

export const writePartialBeeperConfig: typeof api.writePartialBeeperConfig = (
  port,
  config
) =>
  delay(50).then(() => {
    mockDevice.beeper = mergeDeep(mockDevice.beeper, config);
  });

export const readDisabledSensors = (port: string) =>
  delay(15).then(() => mockDevice.disabledSensors);

export const writeDisabledSensors = (
  port: string,
  disabledSensors: Sensors[]
) =>
  delay(20).then(() => {
    mockDevice.disabledSensors = disabledSensors;
  });

export const readRxConfig: typeof api.readRxConfig = (port) =>
  delay(20).then(() => mockDevice.rxConfig);

export const writePartialRxConfig: typeof api.writePartialRxConfig = (
  port,
  config
) =>
  delay(20).then(() => {
    mockDevice.rxConfig = mergeDeep(mockDevice.rxConfig, config);
  });

export const readEnabledFeatures: typeof api.readEnabledFeatures = (port) =>
  delay(20).then(() => mockDevice.features);

export const writeEnabledFeatures: typeof api.writeEnabledFeatures = (
  port,
  features
) =>
  delay(20).then(() => {
    mockDevice.features = features;
  });

export const readRCTuning: typeof api.readRCTuning = (port) =>
  delay(20).then(() => mockDevice.rcTuning);

export const readRCDeadband: typeof api.readRCDeadband = (port) =>
  delay(20).then(() => mockDevice.rcDeadband);

export const readRxMap: typeof api.readRxMap = (port) =>
  delay(10).then(() => mockDevice.rxMap);

export const writeRxMap: typeof api.writeRxMap = (port, channelMap) =>
  delay(20).then(() => {
    mockDevice.rxMap = channelMap;
  });

export const readRssiConfig: typeof api.readRssiConfig = (port) =>
  delay(10).then(() => mockDevice.rssi);

export const writeRssiConfig: typeof api.writeRssiConfig = (port, config) =>
  delay(20).then(() => {
    mockDevice.rssi = config;
  });

export const readModeRangeSlots: typeof api.readModeRangeSlots = (port) =>
  delay(20).then(() => mockDevice.modeRangeSlots);

export const writeModeRangeSlot: typeof api.writeModeRangeSlot = (
  port,
  slotId,
  config
) =>
  delay(20).then(() => {
    mockDevice.modeRangeSlots[slotId] = config;
  });

export const readBlackboxConfig: typeof api.readBlackboxConfig = (port) =>
  delay(10).then(() => mockDevice.blackboxConfig);

export const readSdCardSummary: typeof api.readSdCardSummary = (port) =>
  delay(10).then(() => mockDevice.blackboxSdCardSummary);

export const readDataFlashSummary: typeof api.readDataFlashSummary = (port) =>
  delay(10).then(() => mockDevice.blackboxDataFlashSummary);

export const writeBlackboxConfig: typeof api.writeBlackboxConfig = (
  port,
  config
) =>
  delay(20).then(() => {
    mockDevice.blackboxConfig = { ...mockDevice.blackboxConfig, ...config };
  });

export const writePartialBlackboxConfig: typeof api.writePartialBlackboxConfig =
  (port, config) =>
    delay(50).then(() => {
      mockDevice.blackboxConfig = mergeDeep(mockDevice.blackboxConfig, config);
    });

export const readDataFlashChunk: typeof api.readDataFlashChunk = (
  port,
  _,
  chunkSize
) =>
  delay(chunkSize / 50).then(() =>
    Buffer.from(new Array(chunkSize - Math.round(Math.random() * 100)).fill(1))
  );

export const eraseDataFlash: typeof api.eraseDataFlash = (port) =>
  delay(20).then(() => {
    mockDevice.blackboxDataFlashSummary.ready = false;
    delay(20000).then(() => {
      mockDevice.blackboxDataFlashSummary.ready = true;
      mockDevice.blackboxDataFlashSummary.usedSize = 0;
    });
  });

export const readName: typeof api.readName = (port) =>
  delay(15).then(() => mockDevice.name);

export const readFcVariant: typeof api.readFcVariant = (port) =>
  delay(5).then(() => mockDevice.variant);

export const resetConfig: typeof api.resetConfig = (port) =>
  delay(1500).then(() => reset());

export const readVtxConfig: typeof api.readVtxConfig = (port) =>
  delay(100).then(() => mockDevice.vtxConfig);

export const readVtxTableBandsRow: typeof api.readVtxTableBandsRow = (
  port,
  rowNumber
) =>
  delay(10).then(() => {
    const index = rowNumber - 1;
    const row = mockDevice.vtxConfig.table.bands[index];

    if (!row) {
      throw new Error("Bad");
    }

    return row;
  });

export const readVtxTablePowerLevelsRow: typeof api.readVtxTablePowerLevelsRow =
  (port, rowNumber) =>
    delay(10).then(() => {
      const index = rowNumber - 1;
      const row = mockDevice.vtxConfig.table.powerLevels[index];

      if (!row) {
        throw new Error("Bad");
      }

      return row;
    });

export const writePartialVtxConfig: typeof api.writePartialVtxConfig = (
  port,
  config
) =>
  delay(200).then(() => {
    mockDevice.vtxConfig = mergeDeep(mockDevice.vtxConfig, {
      ...config,
      table: { ...config.table },
    });
  });

export const writeVtxTableBandsRow: typeof api.writeVtxTableBandsRow = (
  port,
  row
) =>
  delay(50).then(() => {
    mockDevice.vtxConfig.table.bands[row.rowNumber - 1] = row;
  });

export const writeVtxTablePowerLevelsRow: typeof api.writeVtxTablePowerLevelsRow =
  (port, row) =>
    delay(50).then(() => {
      mockDevice.vtxConfig.table.powerLevels[row.rowNumber - 1] = row;
    });
