/* eslint-disable no-console */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const {
  getTransformer: graphqlTagTransformer,
} = require("ts-transform-graphql-tag");
const { DefinePlugin, NormalModuleReplacementPlugin } = require("webpack");
const { spawn } = require("child_process");
const path = require("path");

module.exports = (_, { mode }) => ({
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: {
    "@serialport/bindings": "commonjs @serialport/bindings",
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
              projectReferences: true,
              getCustomTransformers: () => ({
                before: [graphqlTagTransformer()],
              }),
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
    path: `${__dirname}/build`,
    filename: "renderer.js",
  },
  plugins: [
    new NormalModuleReplacementPlugin(
      /\.graphql$/,
      path.resolve(__dirname, "src/gql/__generated__/index.tsx")
    ),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        reportFiles: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}"],
        build: true,
      },
    }),
  ],
  devtool: "cheap-source-map",
  devServer: {
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn("electron", ["./dev.js"], {
        shell: true,
        env: { NODE_ENV: "development", DEBUG: "api-server:*", ...process.env },
        stdio: "inherit",
      })
        .on("close", () => process.exit(0))
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
});
