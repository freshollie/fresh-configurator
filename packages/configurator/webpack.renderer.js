/* eslint-disable no-console */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const path = require("path");
const { spawn } = require("child_process");

module.exports = (_, { mode }) => ({
  entry: "./src/index.tsx",
  target: "electron-renderer",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: {
    serialport: "commonjs serialport",
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
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
    path: `${__dirname}/app`,
    filename: "renderer.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ],
  devtool: "cheap-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn("electron", ["./app/main.js"], {
        shell: true,
        env: process.env,
        stdio: "inherit",
      })
        .on("close", () => process.exit(0))
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
});
