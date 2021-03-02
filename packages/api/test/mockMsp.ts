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

const responses: Record<string, MspDataView> = {};

const setResponseForCode = (data: number[], code: number): void => {
  responses[code] = new MspDataView(new Uint8Array(data).buffer);
  mockExecute.mockImplementation(async (path, args) => {
    const response = responses[args.code];
    if (!response) {
      throw new Error(`No response set for ${args.code}`);
    }

    return response;
  });
};

export default {
  setApiVersion,
  setResponse,
  setResponseForCode,
  resetResponses: () => {
    Object.keys(responses).forEach((key) => {
      delete responses[key];
    });
  },
  execute: mockExecute,
};
