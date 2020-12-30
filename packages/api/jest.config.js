const { config } = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  displayName: {
    name,
    color: "blue",
  },
  ...config,
  setupFilesAfterEnv: ["./.jest/setup.ts"],
};
