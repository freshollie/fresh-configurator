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
    "!**/stories/**",
    "!**/__generated__/**",
    "!**/dist/**",
    "!*.d.ts",
  ],
};
