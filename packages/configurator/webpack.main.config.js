const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = (_, { mode }) => ({
  entry: "./src/main.ts",
  target: "electron-main",
  resolve: {
    extensions: [".ts", ".mjs", ".js"],
  },
  externals: {
    "@serialport/bindings": "commonjs @serialport/bindings",
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
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
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ["src/main.ts"],
    }),
  ],
  devtool: "cheap-source-map",
});
