/* eslint-disable no-param-reassign */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  presets: ["@storybook/preset-typescript"],
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true,
          },
        },
      ],
    });
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
    config.resolve.extensions.push(".ts", ".tsx");
    // remove the old ts checker and add our own
    config.plugins = config.plugins.filter(
      (plugin) => !(plugin instanceof ForkTsCheckerWebpackPlugin)
    );
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(__dirname, "../tsconfig.json"),
        reportFiles: [path.join(__dirname, "../stories/*.tsx")],
      })
    );
    return config;
  },
};
