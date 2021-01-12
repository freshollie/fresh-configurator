const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { NormalModuleReplacementPlugin } = require("webpack");
const { spawn } = require("child_process");
const { commonPlugins, devtool, ignoreWarnings } = require("./shared");

module.exports = (_, { mode }) => ({
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
        test: /\.ts(x?)$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              projectReferences: true,
            },
          },
        ],
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
  plugins: [
    new NormalModuleReplacementPlugin(/\.graphql$/, (resource) => {
      // eslint-disable-next-line no-param-reassign
      resource.request += ".ts";
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // Only typecheck in production
    ...(mode === "production"
      ? [
          new ForkTsCheckerWebpackPlugin({
            typescript: {
              reportFiles: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}"],
              build: true,
            },
          }),
        ]
      : []),
    ...commonPlugins(mode),
  ],
  devtool: devtool(mode),
  ignoreWarnings: ignoreWarnings(mode),
  devServer: {
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn("yarn", ["start:main"], {
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
