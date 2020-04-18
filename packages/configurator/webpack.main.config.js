const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = (_, { mode }) => ({
  entry: require.resolve("./src/main.ts"),
  target: "electron-main",
  resolve: {
    extensions: [".ts", ".mjs", ".js", ".node"],
  },
  externals: [
    // Don't try to pack referenced .node files
    (__, request, callback) => {
      if (/\.node$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],

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
