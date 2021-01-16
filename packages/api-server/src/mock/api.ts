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
  BeeperConfig,
} from "@betaflight/api";
import { v4 } from "uuid";

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

const mockDevice = {
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
    ports: new Array(5).fill(0).map((i) => ({
      id: i,
      functions: [
        SerialPortFunctions.BLACKBOX,
        SerialPortFunctions.MSP,
        SerialPortFunctions.TELEMETRY_LTM,
      ],
      mspBaudRate: 115200,
      gpsBaudRate: -1,
      telemetryBaudRate: 115200,
      blackboxBaudRate: 115200,
    })),
  },
  advancedPidConfig: {
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
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    targetCapabilities: 55,
    targetName: "STM32F411",
  },
  mixerConfig: {
    mixer: 3,
    reversedMotors: false,
  },
  beeper: {
    conditions: [],
    dshot: {
      tone: 0,
      conditions: [Beepers.RX_LOST] as (Beepers.RX_LOST | Beepers.RX_SET)[],
    },
  },
  disabledSensors: [Sensors.MAGNETOMETER],
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

export const ports = (): Promise<string[]> => delay(10).then(() => mockPorts);

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

export const readRcValues = (): Promise<number[]> =>
  delay(10).then(() => mockDevice.channels);

export const readSerialConfig = (): Promise<typeof mockDevice["serial"]> =>
  delay(50).then(() => mockDevice.serial);

export const readUID = (port: string): Promise<string> =>
  delay(30).then(() => {
    const id = ids[port];
    if (id) {
      return id;
    }
    throw new Error("Port does not exist");
  });

export const writeReboot = (port: string): Promise<boolean> =>
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

export const readAdvancedPidConfig = (port: string) =>
  delay(30).then(() => mockDevice.advancedPidConfig);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const writePidProtocols = (port: string, protocols: any) =>
  delay(20).then(() => {
    mockDevice.advancedPidConfig = {
      ...mockDevice.advancedPidConfig,
      ...protocols,
    };
  });

export const readBoardInfo = (port: string) =>
  delay(10).then(() => mockDevice.boardInfo);

export const readMixerConfig = (port: string) =>
  delay(15).then(() => mockDevice.mixerConfig);

export const writeMotorDirection = (port: string, reversed: boolean) =>
  delay(50).then(() => {
    mockDevice.mixerConfig.reversedMotors = reversed;
  });

export const writeDigitalIdleSpeed = (port: string, idlePercentage: number) =>
  delay(10).then(() => {
    mockDevice.advancedPidConfig.digitalIdlePercent = idlePercentage;
  });

export const readBeeperConfig = (port: string) =>
  delay(20).then(() => mockDevice.beeper);

export const writeDshotBeeperConfig = (
  port: string,
  config: BeeperConfig["dshot"]
) =>
  delay(50).then(() => {
    mockDevice.beeper.dshot = config;
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
