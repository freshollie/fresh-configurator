module.exports = {
  config: {
    transform: {
      "^.+\\.tsx?$": "esbuild-jest",
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
  },
};
