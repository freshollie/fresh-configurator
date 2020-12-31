import mockMsp from "./mockMsp";
import { readMixerConfig } from "../src";

describe("readMixerConfig", () => {
  it("should read the mixer config for a v1.38.0 device", async () => {
    mockMsp.setResponse([3, 1]);
    mockMsp.setApiVersion("1.38.0");

    expect(await readMixerConfig("/dev/someport")).toEqual({
      mixer: 3,
      reversedMotors: true,
    });
  });

  it("should read the mixer config for a legacy device", async () => {
    mockMsp.setResponse([3]);
    mockMsp.setApiVersion("1.17.0");

    expect(await readMixerConfig("/dev/someport")).toEqual({
      mixer: 3,
      reversedMotors: false,
    });
  });
});
