import { useRef, useState, useEffect } from "react";

const MID_RC = 1500;

const constrain = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

const rcCommand = (rcData: number, rcRate: number, deadband: number): number =>
  Math.min(Math.max(Math.abs(rcData - MID_RC) - deadband, 0), 500) *
  rcRate *
  (rcData < MID_RC ? -1 : 1);

const calcRate = (
  rcData: number,
  rate: number,
  rcRate: number,
  rcExpo: number,
  superExpoActive: boolean,
  deadband: number,
  limit: number,
  legacy: boolean
): number => {
  let fullRcRate = rcRate;

  if (rcRate > 2) {
    fullRcRate += (rcRate - 2) * 14.54;
  }

  const maxRc = 500 * fullRcRate;
  let rcCommandf = rcCommand(rcData, fullRcRate, deadband) / maxRc;
  const rcCommandfAbs = Math.abs(rcCommandf);

  const expoPower = legacy ? 2 : 3;
  const rcRateConstant = legacy ? 205.85 : 200;

  if (rcExpo > 0) {
    rcCommandf =
      rcCommandf * rcCommandfAbs ** expoPower * rcExpo +
      rcCommandf * (1 - rcExpo);
  }

  const rcFactor = 1 / constrain(1 - rcCommandfAbs * rate, 0.01, 1);

  const angleRate = constrain(
    superExpoActive
      ? rcRateConstant * fullRcRate * rcCommandf * rcFactor // 200 should be variable checked on version (older versions it's 205,9)
      : ((rate * 100 + 27) * rcCommandf) / 16 / 4.1, // Only applies to old versions ?
    -1 * limit,
    limit
  ); // Rate limit from profile;

  return angleRate;
};

type DeadbandData = {
  deadband: number;
  yawDeadband: number;
};
type TuningData = {
  rollRate: number;
  rcRate: number;
  rcExpo: number;
  rollRateLimit: number;

  pitchRate: number;
  rcPitchRate: number;
  rcPitchExpo: number;
  pitchRateLimit: number;

  yawRate: number;
  rcYawRate: number;
  rcYawExpo: number;
  yawRateLimit: number;
};

export default (
  channels?: readonly number[],
  tuning?: TuningData,
  deadband?: DeadbandData,
  legacy = false
): { roll: number; pitch: number; yaw: number } => {
  // Keep track of the time between calculations to work out the delta
  const timeRef = useRef(new Date().getTime());
  const [attitude, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0,
  });

  const { roll, pitch, yaw } = attitude;

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (new Date().getTime() - timeRef.current) / 1000;
      timeRef.current = new Date().getTime();
      if (tuning && deadband && channels) {
        setAttitude({
          roll:
            (roll +
              delta *
                calcRate(
                  channels[0] ?? 0,
                  tuning.rollRate,
                  tuning.rcRate,
                  tuning.rcExpo,
                  true,
                  deadband.deadband,
                  tuning.rollRateLimit,
                  legacy
                )) %
            360,
          pitch:
            (pitch +
              delta *
                calcRate(
                  channels[1] ?? 0,
                  tuning.pitchRate,
                  tuning.rcPitchRate,
                  tuning.rcPitchExpo,
                  true,
                  deadband.deadband,
                  tuning.pitchRateLimit,
                  legacy
                )) %
            360,
          yaw:
            (yaw +
              delta *
                calcRate(
                  channels[2] ?? 0,
                  tuning.yawRate,
                  tuning.rcYawRate,
                  tuning.rcYawExpo,
                  true,
                  deadband.yawDeadband,
                  tuning.yawRateLimit,
                  legacy
                )) %
            360,
        });
      }
    });

    return () => clearInterval(interval);
  }, [channels, deadband, legacy, pitch, roll, tuning, yaw]);

  return attitude;
};
