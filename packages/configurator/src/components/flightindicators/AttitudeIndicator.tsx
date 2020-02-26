import * as React from "react";
import { constants, InstrumentProps } from "./config";
import {
  FiBox,
  FiCircle,
  HorizonBack,
  HorizonBall,
  HorizonCircle,
  HorizonMechanics
} from "./assets";
import { Instrument } from "./base.styles";

export interface AttitudeProps extends InstrumentProps {
  roll: number;
  pitch: number;
}

const boundedPitch = (pitch: number): number => {
  if (pitch > constants.pitch_bound) return constants.pitch_bound;
  if (pitch < -constants.pitch_bound) return -constants.pitch_bound;

  return pitch;
};

const Attitude: React.FunctionComponent<AttitudeProps> = ({
  pitch,
  showBox,
  roll,
  size
}) => (
  <Instrument size={size}>
    {showBox && <FiBox />}
    <div style={{ transform: `rotate(${roll}deg)` }} className="roll">
      <HorizonBack className="horizon-back" />
      <HorizonBall
        className="horizen-ball"
        style={{ top: `${boundedPitch(pitch) * 0.7}%` }}
      />

      <HorizonCircle className="horizen-circle" />
    </div>
    <HorizonMechanics />
    <FiCircle />
  </Instrument>
);

export default Attitude;
