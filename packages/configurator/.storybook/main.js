/* eslint-disable no-param-reassign */
const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");

module.exports = {
  stories: [path.resolve(__dirname, "../stories/**/*.stories.tsx")],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: path.resolve(__dirname, "../tsconfig.json"),
      reportFiles: [path.resolve(__dirname, "../stories/**/*.{ts,tsx}")],
      compilerOptions: {
        baseUrl: `${__dirname}../../../`,
      },
    },
  },
  webpackFinal: (config) => {
    config.externals = {
      "@serialport/bindings": "commonjs @serialport/bindings",
    };
    config.module.rules = config.module.rules.map((data) => {
      if (`${data.test}`.includes("svg")) {
        data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|model)(\?.*)?$/;
      }
      return data;
    });

    config.module.rules.push({
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
    });

    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "../tsconfig.dev.json"),
      })
    );
    config.plugins.push(
      new NormalModuleReplacementPlugin(/\.graphql$/, (resource) => {
        // eslint-disable-next-line no-param-reassign
        resource.request += ".ts";
      })
    );
    return config;
  },
};
