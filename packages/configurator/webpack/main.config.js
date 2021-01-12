const { commonPlugins, devtool, ignoreWarnings } = require("./shared");

module.exports = (_, { mode }) => ({
  entry: "./src/main.ts",
  target: "electron-main",
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
  plugins: commonPlugins(mode),
  devtool: devtool(mode),
});
