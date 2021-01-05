const { config } = require("./jest.base.js");
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  projects: ["<rootDir>/packages/*/jest.config.js"],
  ...config,
};
