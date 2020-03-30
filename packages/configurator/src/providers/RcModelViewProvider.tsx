import React, { useState, useRef, useEffect } from "react";
import semver from "semver";
import Model from "../components/Model";
import useSelectedPort from "../hooks/useSelectedPort";
import {
  useRcChannelsQuery,
  useRcSettingsQuery,
  useApiVersionQuery
} from "../gql/__generated__";

const MID_RC = 1500;

const constrain = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

const rcCommand = (
  rcData: number,
  rcRate: number,
  deadband: number
): number => {
  const tmp = Math.min(Math.max(Math.abs(rcData - MID_RC) - deadband, 0), 500);

  let result = tmp * rcRate;

  if (rcData < MID_RC) {
    result = -result;
  }

  return result;
};

const calcRate = (
  rcData: number,
  rate: number,
  rcRate: number,
  rcExpo: number,
  superExpoActive: boolean,
  deadband: number,
  limit: number,
  apiVersion: string
): number => {
  let angleRate;
  let fullRcRate = rcRate;

  if (rcRate > 2) {
    fullRcRate += (rcRate - 2) * 14.54;
  }

  const maxRc = 500 * fullRcRate;
  let rcCommandf = rcCommand(rcData, fullRcRate, deadband) / maxRc;
  const rcCommandfAbs = Math.abs(rcCommandf);
  let expoPower;
  let rcRateConstant;

  if (semver.gte(apiVersion, "1.20.0")) {
    expoPower = 3;
    rcRateConstant = 200;
  } else {
    expoPower = 2;
    rcRateConstant = 205.85;
  }

  if (rcExpo > 0) {
    rcCommandf =
      rcCommandf * rcCommandfAbs ** expoPower * rcExpo +
      rcCommandf * (1 - rcExpo);
  }

  if (superExpoActive) {
    const rcFactor = 1 / constrain(1 - rcCommandfAbs * rate, 0.01, 1);
    angleRate = rcRateConstant * fullRcRate * rcCommandf; // 200 should be variable checked on version (older versions it's 205,9)
    angleRate *= rcFactor;
  } else {
    angleRate = ((rate * 100 + 27) * rcCommandf) / 16 / 4.1; // Only applies to old versions ?
  }

  angleRate = constrain(angleRate, -1 * limit, limit); // Rate limit from profile

  return angleRate;
};

const RcModelViewProvider: React.FC = () => {
  const timeRef = useRef(new Date().getTime());
  const [{ roll, pitch, heading }, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    heading: 0
  });

  const port = useSelectedPort();
  const { data: rcSettingsData } = useRcSettingsQuery({
    variables: {
      port: port ?? ""
    },
    skip: !port
  });

  const { data: apiVersionData } = useApiVersionQuery({
    variables: {
      port: port ?? ""
    },
    skip: !port
  });
  const apiVersion = apiVersionData?.device.apiVersion ?? "0";

  const { data: channelsData } = useRcChannelsQuery({
    variables: {
      port: port ?? ""
    },
    skip: !port,
    pollInterval: 10
  });

  const channels = channelsData?.device.rc.channels ?? [0, 0, 0, 0];

  useEffect(() => {
    const rc = rcSettingsData?.device.rc;
    const delta = new Date().getTime() - timeRef.current;
    if (rc) {
      timeRef.current = new Date().getTime();

      setAttitude({
        roll:
          roll +
          delta *
            calcRate(
              channels[0],
              rc.tuning.rollRate,
              rc.tuning.rcRate,
              rc.tuning.rcExpo,
              true,
              rc.deadband.deadband,
              rc.tuning.rollRateLimit,
              apiVersion
            ),
        pitch:
          pitch +
          delta *
            calcRate(
              channels[1],
              rc.tuning.pitchRate,
              rc.tuning.rcPitchRate,
              rc.tuning.rcPitchExpo,
              true,
              rc.deadband.deadband,
              rc.tuning.pitchRateLimit,
              apiVersion
            ),
        heading:
          heading +
          delta *
            calcRate(
              channels[2],
              rc.tuning.yawRate,
              rc.tuning.rcYawRate,
              rc.tuning.rcYawExpo,
              true,
              rc.deadband.yawDeadband,
              rc.tuning.yawRateLimit,
              apiVersion
            )
      });
    }
  }, [
    apiVersion,
    apiVersionData,
    channels,
    heading,
    pitch,
    rcSettingsData,
    roll
  ]);

  return (
    <Model
      name="quadx"
      attitude={{
        roll,
        pitch,
        heading
      }}
    />
  );
};

export default RcModelViewProvider;
