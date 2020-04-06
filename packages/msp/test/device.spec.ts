import { execute } from "../src/serial/connection";
import MspDataView from "../src/serial/dataview";
import { readAttitude } from "../src";
import codes from "../src/serial/codes";

jest.mock("../src/serial/connection");
const mockExecute = (execute as unknown) as jest.MockedFunction<typeof execute>;

const simulateResponse = (data: number[]): void => {
  mockExecute.mockResolvedValue(new MspDataView(new Uint8Array(data).buffer));
};

describe("readAttitude", () => {
  it("should read attitude data from the device", async () => {
    simulateResponse([99, 0, 54, 1, 12, 1]);

    expect(await readAttitude("/dev/someport")).toEqual({
      heading: 268,
      pitch: 31,
      roll: 9.9,
    });

    expect(mockExecute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_ATTITUDE,
    });
  });
});
