const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs"
  ],
  presets: ["@storybook/preset-typescript"],
  webpackFinal: config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true
          }
        }
      ]
    });
    config.module.rules = config.module.rules.map( data => {
      if (/svg\|/.test( String( data.test ) ))
        data.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;
      return data;
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "react-svg-loader" }]
    });
    config.resolve.extensions.push(".ts", ".tsx");
    config.plugins.push(new ForkTsCheckerWebpackPlugin());
    return config;
  }
};
