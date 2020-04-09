const { DefinePlugin } = require("webpack");

module.exports = (_, { mode }) => ({
  entry: "./src/main.ts",
  target: "electron-main",
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  output: {
    path: `${__dirname}/app`,
    filename: "main.js",
  },
  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ],
});
