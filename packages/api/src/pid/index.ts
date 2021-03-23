import { apiVersion, execute, WriteBuffer } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { partialWriteFunc } from "../utils";
import {
  AdvancedPidConfig,
  AntiGravityModes,
  FilterConfig,
  FilterTypes,
  PidConfig,
} from "./types";

export type { AdvancedPidConfig, FilterConfig, PidConfig };
export { AntiGravityModes, FilterTypes };

export const readFilterConfig = async (port: string): Promise<FilterConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_FILTER_CONFIG });

  const config: FilterConfig = {
    gyro: {
      hardwareLpf: 0,
      hardwareLpf32khz: 0,
      lowpass: {
        hz: 0,
        dyn: {
          minHz: 0,
          maxHz: 0,
        },
        type: FilterTypes.PT1,
      },
      lowpass2: {
        hz: 0,
        type: FilterTypes.PT1,
      },
      notch: {
        hz: 0,
        cutoff: 0,
      },
      notch2: {
        hz: 0,
        cutoff: 0,
      },
      rpmNotch: {
        harmonics: 0,
        minHz: 0,
      },
    },
    dterm: {
      lowpass: {
        hz: 0,
        dyn: {
          minHz: 0,
          maxHz: 0,
        },
        type: FilterTypes.PT1,
      },
      lowpass2: {
        hz: 0,
        type: FilterTypes.PT1,
      },
      notch: {
        hz: 0,
        cutoff: 0,
      },
    },
    dyn: {
      lpfCurveExpo: 0,
      notch: {
        range: 0,
        widthPrecent: 0,
        q: 0,
        minHz: 0,
        maxHz: 0,
      },
    },
    yaw: {
      lowpass: {
        hz: 0,
      },
    },
  };

  config.gyro.lowpass.hz = data.readU8();
  config.dterm.lowpass.hz = data.readU16();
  config.yaw.lowpass.hz = data.readU16();
  if (semver.gte(api, "1.20.0")) {
    config.gyro.notch.hz = data.readU16();
    config.gyro.notch.cutoff = data.readU16();
    config.dterm.notch.hz = data.readU16();
    config.dterm.notch.cutoff = data.readU16();
  }
  if (semver.gte(api, "1.21.0")) {
    config.gyro.notch2.hz = data.readU16();
    config.gyro.notch2.cutoff = data.readU16();
  }
  if (semver.gte(api, "1.36.0")) {
    config.dterm.lowpass.type = data.readU8();
  }
  if (semver.gte(api, "1.39.0")) {
    config.gyro.hardwareLpf = data.readU8();
    const gyro32khzHardwareLpf = data.readU8();
    config.gyro.lowpass.hz = data.readU16();
    config.gyro.lowpass2.hz = data.readU16();
    config.gyro.lowpass.type = data.readU8();
    config.gyro.lowpass2.type = data.readU8();
    config.dterm.lowpass2.hz = data.readU16();
    config.gyro.hardwareLpf32khz = semver.lt(api, "1.41.0")
      ? gyro32khzHardwareLpf
      : 0;
  }

  if (semver.gte(api, "1.41.0")) {
    config.dterm.lowpass2.type = data.readU8();
    config.gyro.lowpass.dyn.minHz = data.readU16();
    config.gyro.lowpass.dyn.maxHz = data.readU16();
    config.dterm.lowpass.dyn.minHz = data.readU16();
    config.dterm.lowpass.dyn.maxHz = data.readU16();
  }
  if (semver.gte(api, "1.42.0")) {
    config.dyn.notch.range = data.readU8();
    config.dyn.notch.widthPrecent = data.readU8();
    config.dyn.notch.q = data.readU16();
    config.dyn.notch.minHz = data.readU16();

    config.gyro.rpmNotch.harmonics = data.readU8();
    config.gyro.rpmNotch.minHz = data.readU8();
  }
  if (semver.gte(api, "1.43.0")) {
    config.dyn.notch.maxHz = data.readU16();
  }
  if (semver.gte(api, "1.44.0")) {
    config.dyn.lpfCurveExpo = data.readU8();
  }

  return config;
};

export const writeFilterConfig = async (
  port: string,
  config: FilterConfig
): Promise<void> => {
  const api = apiVersion(port);

  const buffer = new WriteBuffer();
  buffer
    .push8(config.gyro.lowpass.hz)
    .push16(config.dterm.lowpass.hz)
    .push16(config.yaw.lowpass.hz);

  if (semver.gte(api, "1.20.0")) {
    buffer
      .push16(config.gyro.notch.hz)
      .push16(config.gyro.notch.cutoff)
      .push16(config.dterm.notch.hz)
      .push16(config.dterm.notch.cutoff);
  }

  if (semver.gte(api, "1.21.0")) {
    buffer.push16(config.gyro.notch2.hz).push16(config.gyro.notch2.cutoff);
  }

  if (semver.gte(api, "1.36.0")) {
    buffer.push8(config.dterm.lowpass.type);
  }

  if (semver.gte(api, "1.39.0")) {
    buffer
      .push8(config.gyro.hardwareLpf)
      .push8(semver.lt(api, "1.41.0") ? config.gyro.hardwareLpf32khz : 0)
      .push16(config.gyro.lowpass.hz)
      .push16(config.gyro.lowpass2.hz)
      .push8(config.gyro.lowpass.type)
      .push8(config.gyro.lowpass2.type)
      .push16(config.dterm.lowpass2.hz);
  }

  if (semver.gte(api, "1.41.0")) {
    buffer
      .push8(config.dterm.lowpass2.type)
      .push16(config.gyro.lowpass.dyn.minHz)
      .push16(config.gyro.lowpass.dyn.maxHz)
      .push16(config.dterm.lowpass.dyn.minHz)
      .push16(config.dterm.lowpass.dyn.maxHz);
  }

  if (semver.gte(api, "1.42.0")) {
    buffer
      .push8(config.dyn.notch.range)
      .push8(config.dyn.notch.widthPrecent)
      .push16(config.dyn.notch.q)
      .push16(config.dyn.notch.minHz)
      .push8(config.gyro.rpmNotch.harmonics)
      .push8(config.gyro.rpmNotch.minHz);
  }

  if (semver.gte(api, "1.43.0")) {
    buffer.push16(config.dyn.notch.maxHz);
  }

  if (semver.gte(api, "1.44.0")) {
    buffer.push8(config.dyn.lpfCurveExpo);
  }

  await execute(port, { code: codes.MSP_SET_FILTER_CONFIG, data: buffer });
};

export const writePartialFilterConfig = partialWriteFunc(
  readFilterConfig,
  writeFilterConfig
);

export const readAdvancedPidConfig = async (
  port: string
): Promise<AdvancedPidConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_PID_ADVANCED });
  const config: AdvancedPidConfig = {
    rollPitchItermIgnoreRate: 0,
    yaw: {
      itermIgnoreRate: 0,
      pLimit: 0,
    },
    deltaMethod: 0,
    vbatPidCompensation: 0,
    dtermSetpoint: {
      transition: 0,
      weight: 0,
    },
    toleranceBand: 0,
    toleranceBandReduction: 0,
    pid: {
      maxVelocity: 0,
      maxVelocityYaw: 0,
    },
    dMin: {
      roll: 0,
      pitch: 0,
      yaw: 0,
      gain: 0,
      advance: 0,
    },
    levelAngleLimit: 0,
    levelSensitivity: 0,
    iterm: {
      throttleGain: 0,
      throttleThreshold: 0,
      acceleratorGain: 0,
      rotation: 0,
      relax: 0,
      relaxType: 0,
      relaxCutoff: 0,
    },
    smartFeedForward: 0,
    absoluteControlGain: 0,
    throttleBoost: 0,
    acroTrainerAngleLimit: 0,
    antiGravityMode: AntiGravityModes.SMOOTH,
    useIntegratedYaw: false,
    integratedYawRelax: 0,
    motorOutputLimit: 0,
    autoProfileCellCount: 0,
    idleMinRpm: 0,
    feedForward: {
      roll: 0,
      pitch: 0,
      yaw: 0,
      transition: 0,
      interpolateSp: 0,
      smoothFactor: 0,
      boost: 0,
    },
    vbatSagCompensation: 0,
    thrustLinearization: 0,
  };

  if (semver.gte(api, "1.16.0")) {
    config.rollPitchItermIgnoreRate = data.readU16();
    config.yaw.itermIgnoreRate = data.readU16();
    config.yaw.pLimit = data.readU16();
    config.deltaMethod = data.readU8();
    config.vbatPidCompensation = data.readU8();
  }

  if (semver.gte(api, "1.20.0")) {
    if (semver.gte(api, "1.40.0")) {
      config.feedForward.transition = data.readU8();
    } else {
      config.dtermSetpoint.transition = data.readU8();
    }
    config.dtermSetpoint.weight = data.readU8();
    config.toleranceBand = data.readU8();
    config.toleranceBandReduction = data.readU8();
    config.iterm.throttleGain = data.readU8();
    config.pid.maxVelocity = data.readU16();
    config.pid.maxVelocityYaw = data.readU16();
  }

  if (semver.gte(api, "1.24.0")) {
    config.levelAngleLimit = data.readU8();
    config.levelSensitivity = data.readU8();
  }

  if (semver.gte(api, "1.36.0")) {
    config.iterm.throttleThreshold = data.readU16();
    config.iterm.acceleratorGain = data.readU16();
  }

  if (semver.gte(api, "1.39.0")) {
    config.dtermSetpoint.weight = data.readU16();
  }

  if (semver.gte(api, "1.40.0")) {
    config.iterm.rotation = data.readU8();
    config.smartFeedForward = data.readU8();
    config.iterm.relax = data.readU8();
    config.iterm.relaxType = data.readU8();
    config.absoluteControlGain = data.readU8();
    config.throttleBoost = data.readU8();
    config.acroTrainerAngleLimit = data.readU8();
    config.feedForward.roll = data.readU16();
    config.feedForward.pitch = data.readU16();
    config.feedForward.yaw = data.readU16();
    config.antiGravityMode = data.readU8();
  }

  if (semver.gte(api, "1.41.0")) {
    config.dMin.roll = data.readU8();
    config.dMin.pitch = data.readU8();
    config.dMin.yaw = data.readU8();
    config.dMin.gain = data.readU8();
    config.dMin.advance = data.readU8();
    config.useIntegratedYaw = data.readU8() !== 0;
    config.integratedYawRelax = data.readU8();
  }

  if (semver.gte(api, "1.42.0")) {
    config.iterm.relaxCutoff = data.readU8();
  }

  if (semver.gte(api, "1.43.0")) {
    config.motorOutputLimit = data.readU8();
    config.autoProfileCellCount = data.read8();
    config.idleMinRpm = data.readU8();
  }

  if (semver.gte(api, "1.44.0")) {
    config.feedForward.interpolateSp = data.readU8();
    config.feedForward.smoothFactor = data.readU8();
    config.feedForward.boost = data.readU8();
    config.vbatSagCompensation = data.readU8();
    config.thrustLinearization = data.readU8();
  }

  return config;
};

export const writeAdvancedPidConfig = async (
  port: string,
  config: AdvancedPidConfig
): Promise<void> => {
  const api = apiVersion(port);
  if (semver.lt(api, "1.16.0")) {
    // This API doesn't do anything
    return;
  }

  const buffer = new WriteBuffer();
  buffer
    .push16(config.rollPitchItermIgnoreRate)
    .push16(config.yaw.itermIgnoreRate)
    .push16(config.yaw.pLimit)
    .push8(config.deltaMethod)
    .push8(config.vbatPidCompensation);

  if (semver.gte(api, "1.20.0")) {
    if (semver.gte(api, "1.40.0")) {
      buffer.push8(config.feedForward.transition);
    } else {
      buffer.push8(config.dtermSetpoint.transition);
    }
    buffer
      .push8(Math.min(config.dtermSetpoint.weight, 254))
      .push8(config.toleranceBand)
      .push8(config.toleranceBandReduction)
      .push8(config.iterm.throttleGain)
      .push16(config.pid.maxVelocity)
      .push16(config.pid.maxVelocityYaw);
  }

  if (semver.gte(api, "1.24.0")) {
    buffer.push8(config.levelAngleLimit).push8(config.levelSensitivity);
  }

  if (semver.gte(api, "1.36.0")) {
    buffer
      .push16(config.iterm.throttleThreshold)
      .push16(config.iterm.acceleratorGain);
  }

  if (semver.gte(api, "1.39.0")) {
    buffer.push16(config.dtermSetpoint.weight);
  }

  if (semver.gte(api, "1.40.0")) {
    buffer
      .push8(config.iterm.rotation)
      .push8(config.smartFeedForward)
      .push8(config.iterm.relax)
      .push8(config.iterm.relaxType)
      .push8(config.absoluteControlGain)
      .push8(config.throttleBoost)
      .push8(config.acroTrainerAngleLimit)
      .push16(config.feedForward.roll)
      .push16(config.feedForward.pitch)
      .push16(config.feedForward.yaw)
      .push8(config.antiGravityMode);
  }

  if (semver.gte(api, "1.41.0")) {
    buffer
      .push8(config.dMin.roll)
      .push8(config.dMin.pitch)
      .push8(config.dMin.yaw)
      .push8(config.dMin.gain)
      .push8(config.dMin.advance)
      .push8(config.useIntegratedYaw ? 1 : 0)
      .push8(config.integratedYawRelax);
  }

  if (semver.gte(api, "1.42.0")) {
    buffer.push8(config.iterm.relaxCutoff);
  }

  if (semver.gte(api, "1.43.0")) {
    buffer
      .push8(config.motorOutputLimit)
      .push8(config.autoProfileCellCount)
      .push8(config.idleMinRpm);
  }

  if (semver.gte(api, "1.44.0")) {
    buffer
      .push8(config.feedForward.interpolateSp)
      .push8(config.feedForward.smoothFactor)
      .push8(config.feedForward.boost)
      .push8(config.vbatSagCompensation)
      .push8(config.thrustLinearization);
  }

  await execute(port, { code: codes.MSP_SET_PID_ADVANCED, data: buffer });
};

export const writePartialAdvancedPidConfig = partialWriteFunc(
  readAdvancedPidConfig,
  writeAdvancedPidConfig
);

const pidNames: (keyof PidConfig)[] = ["roll", "pitch", "yaw", "level", "mag"];

export const readPidConfig = async (port: string): Promise<PidConfig> => {
  const data = await execute(port, { code: codes.MSP_PID });
  return pidNames.reduce(
    (config, key) => ({
      ...config,
      [key]: {
        p: data.readU8(),
        i: data.readU8(),
        d: data.readU8(),
      },
    }),
    {} as PidConfig
  );
};

export const writePidConfig = async (
  port: string,
  config: PidConfig
): Promise<void> => {
  const buffer = new WriteBuffer();
  pidNames.forEach((key) => {
    const { p, i, d } = config[key];
    buffer.push8(p).push8(i).push8(d);
  });

  await execute(port, { code: codes.MSP_SET_PID, data: buffer });
};

export const writePartialPidConfig = partialWriteFunc(
  readPidConfig,
  writePidConfig
);
