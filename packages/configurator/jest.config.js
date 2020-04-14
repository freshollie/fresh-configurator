const base = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  displayName: {
    name,
    color: "green",
  },
  setupFiles: ["jest-date-mock"],
  setupFilesAfterEnv: ["./.jest/setup.ts"],
  moduleDirectories: ["node_modules", "src"],
  // Mock any files which webpack would convert to file paths
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "\\.graphql": "<rootDir>/src/gql/__generated__/index.tsx",
  },
  ...base,
};
