const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { NormalModuleReplacementPlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");
const WebpackBar = require("webpackbar");
const { spawn } = require("child_process");
const tsconfig = require("../tsconfig.json");
const { ignoreWarnings } = require("./shared");

module.exports = (_, { mode }) => ({
  target: "es2018",
  mode: mode || "development",
  entry: "./src/index.tsx",
  watchOptions: {
    ignored: ["build/**/*"],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js"],
    fallback: {
      stream: false,
      util: false,
      path: false,
      tty: false,
    },
  },
  externals: {
    "@serialport/bindings": "commonjs @serialport/bindings",
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
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|model)(\?.*)?$/,
        loader: "file-loader",
      },
    ],
  },
  output: {
    path: `${__dirname}/../build`,
    filename: "renderer.js",
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
    new ESBuildPlugin(),
    new NormalModuleReplacementPlugin(/\.graphql$/, (resource) => {
      // eslint-disable-next-line no-param-reassign
      resource.request += ".ts";
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // Only typecheck in production
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        reportFiles: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}"],
        build: true,
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
  ],
  devtool: mode === "production" ? "inline-source-map" : "source-map",
  ignoreWarnings: ignoreWarnings(mode),
  devServer: {
    stats: {
      colors: true,
      chunks: true,
      children: true,
    },
    before() {
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
