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
  setupFiles: undefined,
  setupFilesAfterEnv: undefined,
  collectCoverage: false,
  maxWorkers: 2,
};
