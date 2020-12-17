const config = require("./jest.config");

module.exports = {
  ...config,
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/dist/",
    "<rootDir>/.*/__mocks__",
  ],
  testRegex: "storyshots\\.[A-z]+\\.ts$",
  setupFiles: undefined,
  collectCoverage: false,
  maxWorkers: 2,
};
