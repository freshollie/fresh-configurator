const { SourceMapDevToolPlugin } = require("webpack");

const devtool = (mode) =>
  mode !== "production" ? "cheap-source-map" : undefined;

const commonPlugins = (mode) => [
  ...(mode === "production"
    ? [
        new SourceMapDevToolPlugin({
          noSources: true,
        }),
      ]
    : []),
];

const ignoreWarnings = () => [
  // Can't help these
  {
    message: /Critical dependency: the request of a dependency is an expression/,
  },
  {
    message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
  },
  // optional peer deps
  { message: /supports-color/ },
  { message: /utf-8-validate/ },
  { message: /bufferutil/ },
];

module.exports = {
  devtool,
  commonPlugins,
  ignoreWarnings,
};
