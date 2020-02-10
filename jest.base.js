module.exports = {
  resetMocks: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/storybook-static/",
    "/__generated__/"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/stories/**",
    "!**/__generated__/**",
    "!**/dist/**",
    "!*.d.ts"
  ]
};
