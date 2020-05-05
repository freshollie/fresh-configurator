const config = require("./jest.config");

module.exports = {
  ...config,
  testRegex: "storyshots.runner.ts",
  setupFiles: undefined,
  collectCoverage: false,
};
