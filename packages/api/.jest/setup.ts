import * as msp from "@betaflight/msp";

jest.mock("@betaflight/msp", () => ({
  ...jest.requireActual<typeof msp>("@betaflight/msp"),
  execute: jest.fn(),
  apiVersion: jest.fn(),
}));
