/* eslint-disable no-param-reassign */
const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    {
      name: "@storybook/preset-typescript",
      options: {
        tsLoaderOptions: {
          transpileOnly: true,
        },
        forkTsCheckerWebpackPluginOptions: {
          tsconfig: path.resolve(__dirname, "../tsconfig.storybook.json"),
        },
      },
    },
  ],
  webpackFinal: (config) => {
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
    return config;
  },
};
