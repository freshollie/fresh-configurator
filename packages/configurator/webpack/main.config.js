const WebpackBar = require("webpackbar");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");
const { ignoreWarnings } = require("./shared");
const tsconfig = require("../tsconfig.json");

module.exports = (_, { mode }) => ({
  mode: mode || "development",
  entry: "./src/main.ts",
  target: "electron11.1-main",
  resolve: {
    extensions: [".ts", ".mjs", ".js", ".node"],
  },
  externals: [
    // Don't try to pack referenced .node files
    ({ request }, callback) => {
      if (/\.node$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],
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
        test: /\.js$/,
        loader: "@betaflight-tools/bindings-loader",
      },
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ],
  },
  output: {
    path: `${__dirname}/../build`,
    filename: "main.js",
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
    new ESBuildPlugin(),
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
  ],
  devtool: "source-map",
});
