const base = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  ...base,
  displayName: {
    name,
    color: "magenta",
  },
  setupFiles: ["./.jest/setup.ts"],
};
