const base = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  ...base,
  displayName: {
    name,
    color: "green",
  },
  setupFiles: ["jest-date-mock"],
  setupFilesAfterEnv: ["./.jest/setup.ts"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    // Mock any files which webpack would convert to file paths
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    // Change graphql let imports to the generated version of all queries
    "\\.graphql": "<rootDir>/src/gql/__generated__/index.tsx",
    ...base.moduleNameMapper,
  },
};
