import * as api from "@betaflight/api";

// eslint-disable-next-line import/prefer-default-export
export const mockApi = api as jest.Mocked<typeof api>;
