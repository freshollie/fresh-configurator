import { AntiGravityModes, readAdvancedPidConfig } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("readAdvancedPidConfig", () => {
  it("should return the advanced pid config for v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 55, 0, 250, 0, 136,
      19, 0, 0, 1, 0, 0, 0, 0, 5, 20, 60, 0, 60, 0, 60, 0, 0,
    ]);

    const data = await readAdvancedPidConfig("/dev/serial");

    expect(data).toEqual({
      rollPitchItermIgnoreRate: 0,
      yaw: { itermIgnoreRate: 0, pLimit: 0 },
      deltaMethod: 0,
      vbatPidCompensation: 0,
      dtermSetpoint: { transition: 0, weight: 0 },
      toleranceBand: 0,
      toleranceBandReduction: 0,
      pid: { maxVelocity: 0, maxVelocityYaw: 100 },
      dMin: { roll: 0, pitch: 0, yaw: 0, gain: 0, advance: 0 },
      levelAngleLimit: 55,
      levelSensitivity: 0,
      iterm: {
        throttleGain: 0,
        throttleThreshold: 250,
        acceleratorGain: 5000,
        rotation: 1,
        relax: 0,
        relaxType: 0,
        relaxCutoff: 0,
      },
      smartFeedForward: 0,
      absoluteControlGain: 0,
      throttleBoost: 5,
      acroTrainerAngleLimit: 20,
      antiGravityMode: AntiGravityModes.SMOOTH,
      useIntegratedYaw: false,
      integratedYawRelax: 0,
      motorOutputLimit: 0,
      autoProfileCellCount: 0,
      idleMinRpm: 0,
      feedForward: {
        roll: 60,
        pitch: 60,
        yaw: 60,
        transition: 0,
        interpolateSp: 0,
        smoothFactor: 0,
        boost: 0,
      },
      vbatSagCompensation: 0,
      thrustLinearization: 0,
    });
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/serial", {
      code: codes.MSP_PID_ADVANCED,
    });
  });
});
