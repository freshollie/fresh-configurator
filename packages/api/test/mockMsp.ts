import { execute, apiVersion, MspDataView } from "@betaflight/msp";
import * as msp from "@betaflight/msp";

jest.mock("@betaflight/msp", () => ({
  ...jest.requireActual<typeof msp>("@betaflight/msp"),
  execute: jest.fn(),
  apiVersion: jest.fn(),
}));

const mockExecute = (execute as unknown) as jest.MockedFunction<typeof execute>;
const mockApiVersion = (apiVersion as unknown) as jest.MockedFunction<
  typeof apiVersion
>;

const setApiVersion = (version: string): void => {
  mockApiVersion.mockReturnValue(version);
};

const setResponse = (data: number[]): void => {
  mockExecute.mockResolvedValue(new MspDataView(new Uint8Array(data).buffer));
};

export default {
  setApiVersion,
  setResponse,
  execute: mockExecute,
};
