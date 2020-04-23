module.exports = {
  resetMocks: true,
  preset: "ts-jest",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/storybook-static/",
    "/__generated__/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!./tools/**/*",
    "!**/stories/**",
    "!**/__generated__/**",
    "!**/test/**",
    "!**/test-utils.*",
    "!**/dist/**",
    "!**/mocks/**",
    "!*.d.ts",
  ],
  modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/dist/"],
};
