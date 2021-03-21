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

export type DynamicFilterValues = {
  minHz: number;
  maxHz: number;
};

export type FilterConfig = {
  gyro: {
    hardwareLpf: number;
    hardwareLpf32khz: number;
    lowpass: LowpassFilter & {
      dyn: {
        minHz: number;
        maxHz: number;
      };
    };
    lowpass2: {
      hz: number;
      type: number;
    };
    notch: NotchFilter;
    notch2: NotchFilter;
    rpmNotch: {
      harmonics: number;
      minHz: number;
    };
  };
  dterm: {
    lowpass: LowpassFilter & {
      dyn: DynamicFilterValues;
    };
    lowpass2: LowpassFilter;
    notch: NotchFilter;
  };
  dyn: {
    lpfCurveExpo: number;
    notch: {
      range: number;
      widthPrecent: number;
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
};

export enum AntiGravityModes {
  SMOOTH = 0,
  STEP = 1,
}

export type AdvancedPidConfig = {
  rollPitchItermIgnoreRate: number;
  yaw: {
    itermIgnoreRate: number;
    pLimit: number;
  };
  deltaMethod: number;
  vbatPidCompensation: number;
  dtermSetpoint: {
    transition: number;
    weight: number;
  };
  toleranceBand: number;
  toleranceBandReduction: number;
  pid: {
    maxVelocity: number;
    maxVelocityYaw: number;
  };
  dMin: {
    roll: number;
    pitch: number;
    yaw: number;
    gain: number;
    advance: number;
  };
  levelAngleLimit: number;
  levelSensitivity: number;
  iterm: {
    throttleGain: number;
    throttleThreshold: number;
    acceleratorGain: number;
    rotation: number;
    relax: number;
    relaxType: number;
    relaxCutoff: number;
  };
  smartFeedForward: number;
  absoluteControlGain: number;
  throttleBoost: number;
  acroTrainerAngleLimit: number;
  antiGravityMode: AntiGravityModes;
  useIntegratedYaw: boolean;
  integratedYawRelax: number;
  motorOutputLimit: number;
  autoProfileCellCount: number;
  idleMinRpm: number;
  feedForward: {
    roll: number;
    pitch: number;
    yaw: number;
    transition: number;
    interpolateSp: number;
    smoothFactor: number;
    boost: number;
  };
  vbatSagCompensation: number;
  thrustLinearization: number;
};

type Pid = {
  p: number;
  i: number;
  d: number;
};

export type PidConfig = {
  roll: Pid;
  pitch: Pid;
  yaw: Pid;
  level: Pid;
  mag: Pid;
};
