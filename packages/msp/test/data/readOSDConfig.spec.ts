import { execute } from "../../src/serial/connection";
import MspDataView from "../../src/serial/dataview";
import data from "./readOSDConfig.json";
import { readOSDConfig } from "../../src";
import codes from "../../src/serial/codes";

jest.mock("../../src/serial/connection");
const mockExecute = (execute as unknown) as jest.MockedFunction<typeof execute>;

const simulateResponse = (data: number[]): void => {
  mockExecute.mockResolvedValue(new MspDataView(new Uint8Array(data).buffer));
};

describe("readOSDConfig", () => {
  it("should read a 1.42.0 config correctly", async () => {
    simulateResponse(data);
    const config = await readOSDConfig("/dev/something");
    expect(config).toMatchSnapshot();
  });
});
