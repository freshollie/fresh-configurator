export type MixerConfig = {
  mixer: number;
  reversedMotors: boolean;
};

export type MotorConfig = {
  minThrottle: number; // 0-2000
  maxThrottle: number; // 0-2000
  minCommand: number; // 0-2000
  motorCount: number;
  motorPoles: number;
  useDshotTelemetry: boolean;
  useEscSensor: boolean;
};
