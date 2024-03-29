const WebpackBar = require("webpackbar");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const { ignoreWarnings, externals } = require("./shared");
const tsconfig = require("../tsconfig.json");

module.exports = (_, { mode }) => ({
  mode: mode || "development",
  entry: {
    main: "./src/main/index.ts",
    preload: "./src/main/preload.ts",
  },
  target: "electron13.2-main",
  resolve: {
    extensions: [".ts", ".mjs", ".js", ".node"],
  },
  externals: {
    bufferutil: "commonjs bufferutil",
    ...externals,
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
    path: `${__dirname}/../build/main`,
    chunkFormat: "commonjs",
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
  ],
  devtool: "source-map",
  // make it so we don't bundle the API server, or dev-tools if compiling
  ...(mode === "production"
    ? {
        externals: {
          "@betaflight/api-server": "commonjs @betaflight/api-server",
          "electron-devtools-installer": "commonjs electron-devtools-installer",
        },
      }
    : {}),
});
