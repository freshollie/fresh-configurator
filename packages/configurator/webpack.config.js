const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    entry: "./src/main.ts",
    target: "electron-main",
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    output: {
      path: `${__dirname}/app`,
      filename: "main.js",
    },
  },
  {
    entry: "./src/index.tsx",
    target: "electron-renderer",
    devtool: "source-map",
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
    ],
  },
];
