import * as msp from "@betaflight/msp";
import { MspDataView } from "@betaflight/msp";

const mockExecute = (msp.execute as unknown) as jest.MockedFunction<
  typeof msp.execute
>;
const mockApiVersion = (msp.apiVersion as unknown) as jest.MockedFunction<
  typeof msp.apiVersion
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
