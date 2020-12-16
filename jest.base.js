const { pathsToModuleNameMapper } = require("ts-jest/utils");

module.exports = {
  config: {
    resetMocks: true,
    preset: "ts-jest",
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/",
      "/build/",
      "/storybook-static/",
      "/__generated__/",
    ],
    collectCoverageFrom: [
      `**/*.{ts,tsx}`,
      "!**/node_modules/**",
      "!./tools/**/*",
      "!**/stories/**",
      "!**/__generated__/**",
      "!**/test/**",
      "!**/test-utils.*",
      "!**/dist/**",
      "!**/build/**",
      "!**/mocks/**",
      "!**/*.d.ts",
      "!**/.storybook/**",
    ],
    modulePathIgnorePatterns: [
      "<rootDir>/e2e/",
      "<rootDir>/build/",
      "<rootDir>/dist/",
      "<rootDir>/.*/__mocks__",
    ],
    testEnvironment: "node",
    testRunner: "jest-circus/runner",
    moduleNameMapper: pathsToModuleNameMapper(
      {
        "@betaflight/*": ["*/src"],
      },
      {
        prefix: `${__dirname}/node_modules/@betaflight/`,
      }
    ),
  },
};
