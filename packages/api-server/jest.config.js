const { config } = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  ...config,
  displayName: {
    name,
    color: "magenta",
  },
  setupFiles: ["./.jest/setup.ts"],
};
