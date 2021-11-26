/* eslint-disable no-console */
import "@testing-library/jest-dom";

jest.mock("../src/renderer/components/Icon");
jest.mock("../src/renderer/flightindicators/assets");
jest.mock("../src/renderer/logos");
jest.mock("../src/workers/SchemaBackend.bootstrap", () => {
  const mockWorker = {
    onmessage: () => {},
    postMessage: (message: Record<string, unknown>) => {
      if ("type" in message && message.type === "init") {
        mockWorker.onmessage?.({ data: { type: "ready" } } as MessageEvent);
      }
    },
  } as unknown as Worker;

  return mockWorker;
});
