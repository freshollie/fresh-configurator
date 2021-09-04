const { config } = require("./jest.base");

module.exports = {
  projects: ["<rootDir>/packages/*/jest.config.js"],
  ...config,
};
