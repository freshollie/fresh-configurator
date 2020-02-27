const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "development",
    entry: "./src/electron.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }]
        }
      ]
    },
    output: {
      path: `${__dirname}/dist`,
      filename: "electron.js"
    }
  },
  {
    mode: "development",
    entry: "./src/index.tsx",
    target: "electron-renderer",
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    externals: {
      serialport: "commonjs serialport"
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: "ts-loader" }]
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
                      removeViewBox: false
                    },
                    {
                      cleanupIDs: false
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          loader: "file-loader"
        }
      ]
    },
    output: {
      path: `${__dirname}/dist`,
      filename: "react.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ]
  }
];
