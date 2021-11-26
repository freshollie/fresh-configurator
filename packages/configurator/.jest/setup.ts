/* eslint-disable no-console */
import "@testing-library/jest-dom";

jest.mock("../src/renderer/components/Icon");
jest.mock("../src/renderer/flightindicators/assets");
jest.mock("../src/renderer/logos");
jest.mock("../src/workers/SchemaBackend.bootstrap", () => ({
  default: Worker,
}));
