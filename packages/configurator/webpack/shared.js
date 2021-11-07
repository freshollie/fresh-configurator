const ignoreWarnings = () => [
  // Can't help these
  {
    message:
      /Critical dependency: the request of a dependency is an expression/,
  },
  {
    message:
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
  },
];

const externals = {
  bufferutil: "commonjs bufferutil",
  "utf-8-validate": "commonjs utf-8-validate",
  "supports-color": "commonjs supports-color",
};

module.exports = {
  ignoreWarnings,
  externals,
};
