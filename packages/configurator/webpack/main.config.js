const { DefinePlugin } = require("webpack");
const WebpackBar = require("webpackbar");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const { ignoreWarnings } = require("./shared");
const tsconfig = require("../tsconfig.json");

module.exports = (_, { mode }) => ({
  mode: mode || "development",
  entry: {
    main: "./src/electron/main.ts",
    preload: "./src/electron/preload.ts",
  },
  target: "electron11.1-main",
  resolve: {
    extensions: [".ts", ".mjs", ".js", ".node"],
  },
  ignoreWarnings: ignoreWarnings(mode),
  node: {
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        options: {
          loader: "ts",
          tsconfigRaw: tsconfig,
          target: tsconfig.compilerOptions.target.toLowerCase(),
        },
      },
      {
        test: /\.node$/,
        loader: "native-ext-loader",
      },
      {
        test: /\.js$/,
        loader: "node-bindings-loader",
      },
    ],
  },
  output: {
    path: `${__dirname}/../build`,
  },
  optimization: {
    minimize: mode === "production",
    minimizer: [
      new ESBuildMinifyPlugin({
        target: tsconfig.compilerOptions.target.toLowerCase(),
      }),
    ],
  },

  plugins: [
    new WebpackBar({
      name: "main",
      color: "yellow",
    }),
    ...(process.env.REPORT
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "main-report.html",
            openAnalyzer: false,
          }),
        ]
      : []),
    // TODO: remove after https://github.com/apollographql/apollo-client/issues/8674 is fixed
    new DefinePlugin({
      __DEV__: mode === "development"
    }),
  ],
  devtool: "source-map",
});
