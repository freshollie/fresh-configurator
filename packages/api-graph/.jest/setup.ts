import * as api from "@betaflight/api";

// Add to this list for functions you don't want to be mocked
const dontMock: (keyof typeof api)[] = ["channelLetters"];

jest.mock("@betaflight/api", () => {
  const unmocked = jest.requireActual<typeof api>("@betaflight/api");

  return {
    ...jest.createMockFromModule<typeof api>("@betaflight/api"),
    ...Object.fromEntries(dontMock.map((key) => [key, unmocked[key]])),
  };
});

jest.mock("fs", () => jest.requireActual("memfs"));
