const { config } = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  ...config,
  displayName: {
    name,
    color: "blue",
  },
  setupFiles: ["./.jest/setup.ts"],
};
