import { execute, apiVersion, MspDataView } from "@betaflight/msp";

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
