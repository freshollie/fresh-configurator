module.exports = {
  config: {
    preset: "ts-jest",
    resetMocks: true,
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/",
      "/build/",
      "/storybook-static/",
      "/__generated__/",
    ],
    collectCoverageFrom: [
      "**/src/**/*.{ts,tsx}",
      "!**/*.graphql.ts",
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
    globals: {
      "ts-jest": {
        diagnostics: {
          // Duplicate identifier, (only because a pesky gql codegen preset
          // won't let us disable the file)
          // Eslint will catch this anyway in production code
          ignoreCodes: "TS2300",
        },
      },
    },
  },
};
