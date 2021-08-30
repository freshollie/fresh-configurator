const { config } = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  ...config,
  displayName: {
    name,
    color: "green",
  },
  setupFiles: ["jest-date-mock"],
  setupFilesAfterEnv: ["./.jest/setup.ts"],
  moduleNameMapper: {
    // Mock any files which webpack would convert to file paths
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|gltf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    ...config.moduleNameMapper,
  },
  snapshotSerializers: [
    "@emotion/jest/serializer" /* if needed other snapshotSerializers should go here */,
  ],
  testEnvironment: "jest-environment-jsdom",
};
