module.exports = {
  config: {
    transform: {
      "^.+\\.(t|j)sx?$": [
        "@swc/jest",
        {
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            target: "es2020",
          },
          sourceMaps: true,
          module: {
            type: "commonjs",
          },
        },
      ],
    },
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
  },
};
