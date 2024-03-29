/* eslint-disable no-param-reassign */
const path = require("path");

/**
 * Patch the given babel config to allow it to
 * work with yarn pnp.
 *
 * It might be possible to remove this with the next
 * releases of storybook
 */
const fixBabel = (config) => {
  // Filter for only plugins which make sense for us
  const allowed = [
    "babel-plugin-macros",
    "syntax-dynamic-import",
    "babel-plugin-emotion",
    "proposal-class-properties",
    "proposal-export-default-from",
  ];
  config.presets[0][1] = { targets: { esmodules: true } };
  config.plugins = config.plugins.filter(([name]) =>
    allowed.some((plugin) => name.includes(plugin))
  );
  return config;
};

module.exports = {
  stories: [path.resolve(__dirname, "../stories/**/*.stories.tsx")],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    {
      name: "storybook-addon-turbo-build",
      options: {
        optimizationLevel: 2,
      },
    },
    "storybook-dark-mode",
  ],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: path.resolve(__dirname, "../tsconfig.json"),
      reportFiles: [path.resolve(__dirname, "../stories/**/*.{ts,tsx}")],
    },
  },
  webpackFinal: (config) => {
    config.externals = {
      "@serialport/bindings": "commonjs @serialport/bindings",
    };
    config.module.rules = config.module.rules.map((data) => {
      if (`${data.test}`.includes("svg")) {
        data.test =
          /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|gltf)(\?.*)?$/;
      }
      return data;
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: require.resolve("react-svg-loader"),
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

    const es6Rule = config.module.rules.find(
      (rule) =>
        rule.use &&
        rule.use.find(
          (loader) =>
            loader &&
            loader.loader &&
            loader.loader.includes("babel-loader") &&
            loader.options.presets.length > 0
        )
    );

    if (es6Rule) {
      es6Rule.use.forEach((loader) => {
        loader.options = fixBabel(loader.options);
      });
    }

    return config;
  },
  babel: (config) => fixBabel(config),
};
