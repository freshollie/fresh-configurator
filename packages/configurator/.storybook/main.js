/* eslint-disable no-param-reassign */
const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");

module.exports = {
  stories: [path.resolve(__dirname, "../stories/**/*.stories.tsx")],
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
          tsconfig: path.resolve(__dirname, "../tsconfig.json"),
          reportFiles: [path.resolve(__dirname, "../stories/**/*.{ts,tsx}")],
          compilerOptions: {
            baseUrl: null,
          },
        },
      },
    },
  ],
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

    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /\.graphql$/,
        path.resolve(__dirname, "../src/gql/__generated__/index.tsx")
      )
    );
    return config;
  },
};
