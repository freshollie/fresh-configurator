const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const WebpackBar = require("webpackbar");
const { spawn } = require("child_process");
const tsconfig = require("../tsconfig.json");
const { ignoreWarnings, externals } = require("./shared");

module.exports = (_, { mode }) => ({
  target: "es2020",
  mode: mode || "development",
  entry: "./src/index.tsx",
  watchOptions: {
    ignored: ["build/**/*"],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js"],
    fallback: {
      fs: require.resolve("memfs"),
    },
  },
  externals: {
    "@serialport/bindings": "commonjs @serialport/bindings",
    ...externals,
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
          loader: "tsx",
          tsconfigRaw: tsconfig,
          target: tsconfig.compilerOptions.target.toLowerCase(),
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "react-svg-loader",
            options: {
              svgo: {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                  {
                    cleanupIDs: false,
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/inline",
      },
      {
        test: /\.(ico|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|gltf)(\?.*)?$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    path: `${__dirname}/../build`,
    filename: "[name].renderer.js",
    chunkFormat: "array-push",
    chunkLoading: "jsonp",
  },
  optimization: {
    minimize: mode === "production",
    minimizer: [
      new ESBuildMinifyPlugin({
        target: tsconfig.compilerOptions.target.toLowerCase(),
      }),
    ],
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // Only typecheck in production
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        reportFiles: ["src/**/*.{ts,tsx}"],
        build: true,
        mode: "write-references",
      },
      issue: {
        exclude: [
          {
            origin: "typescript",
            file: "!src/**/*.spec.{ts,tsx}",
          },
        ],
      },
    }),
    new WebpackBar({
      name: "renderer",
    }),
    ...(process.env.REPORT
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "renderer-report.html",
            openAnalyzer: false,
          }),
        ]
      : []),
    new NodePolyfillPlugin(),
  ],
  devtool: mode === "production" ? "inline-source-map" : "source-map",
  ignoreWarnings: ignoreWarnings(mode),
  devServer: {
    onBeforeSetupMiddleware() {
      spawn("electron", [`${__dirname}/../build/main.js`], {
        shell: true,
        env: {
          NODE_ENV: "development",
          DEBUG: "api-server:*",
          ...process.env,
        },
        stdio: "inherit",
      })
        .on("close", () => process.exit(0))
        // eslint-disable-next-line no-console
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
});
