const config = require("./jest.config");

module.exports = {
  ...config,
  testRegex: "storyshots\\.[A-z]+\\.ts$",
  setupFiles: undefined,
  collectCoverage: false,
  maxWorkers: 2,
};
