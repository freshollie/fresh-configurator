const path = require("path");
const config = require("./jest.config");

module.exports = {
  ...config,
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/dist/",
    "<rootDir>/.*/__mocks__",
  ],
  rootDir: path.join(__dirname, "e2e"),
  setupFilesAfterEnv: undefined,
  setupFiles: undefined,
  collectCoverage: false,
  testTimeout: 100000,
  maxWorkers: 2,
};
