import { execute, apiVersion } from "../../src/serial/connection";
import MspDataView from "../../src/serial/dataview";
import readOsdData from "./readOSDConfig.json";
import { readOSDConfig } from "../../src";
import codes from "../../src/serial/codes";

jest.mock("../../src/serial/connection");
const mockExecute = (execute as unknown) as jest.MockedFunction<typeof execute>;
const mockApiVersion = (apiVersion as unknown) as jest.MockedFunction<
  typeof apiVersion
>;

const simulateResponse = (data: number[]): void => {
  mockExecute.mockResolvedValue(new MspDataView(new Uint8Array(data).buffer));
};

describe("readOSDConfig", () => {
  it("should read a 1.42.0 config correctly", async () => {
    simulateResponse(readOsdData);
    mockApiVersion.mockReturnValue("1.42.0");

    const config = await readOSDConfig("/dev/something");
    expect(config).toMatchSnapshot();
    expect(mockExecute).toHaveBeenCalledWith("/dev/something", {
      code: codes.MSP_OSD_CONFIG,
    });
  });
});
