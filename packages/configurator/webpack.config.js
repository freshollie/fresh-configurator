const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const {
  getTransformer: graphqlTagTransformer,
} = require("ts-transform-graphql-tag");
const {
  DefinePlugin,
  NormalModuleReplacementPlugin,
  SourceMapDevToolPlugin,
} = require("webpack");
const { spawn } = require("child_process");
const path = require("path");

const devtool = (mode) =>
  mode !== "production" ? "cheap-source-map" : undefined;

const commonPlugins = (mode) => [
  new DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(mode),
  }),
  ...(mode === "production"
    ? [
        new SourceMapDevToolPlugin({
          noSources: true,
        }),
      ]
    : []),
];

// Only run the main config when in production
const mainConfig = (mode) => ({
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
    path: `${__dirname}/build`,
    filename: "main.js",
  },
  plugins: commonPlugins(mode),
  devtool: devtool(mode),
});

const rendererConfig = (mode) => ({
  entry: require.resolve("./src/index.tsx"),
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js"],
  },
  externals: {
    "@serialport/bindings": "commonjs @serialport/bindings",
  },
  module: {
    rules: [
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
              getCustomTransformers: () => ({
                before: [graphqlTagTransformer()],
              }),
            },
          },
        ],
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
    path: `${__dirname}/build`,
    filename: "renderer.js",
  },
  plugins: [
    new NormalModuleReplacementPlugin(
      /\.graphql$/,
      path.resolve(__dirname, "src/gql/__generated__/index.tsx")
    ),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        reportFiles: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}"],
        build: true,
      },
    }),
    ...commonPlugins(mode),
  ],
  devtool: devtool(mode),
  devServer: {
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn("electron", ["./dev.js"], {
        shell: true,
        env: {
          NODE_ENV: "development",
          DEBUG: "api-server:*",
          ...process.env,
        },
        stdio: "inherit",
      })
        .on("close", () => process.exit(0))
        // eslint-disable-next-line no-console
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
});

module.exports = (_, { mode }) => [
  rendererConfig(mode),
  // Don't build the main
  ...(mode === "production" ? mainConfig(mode) : []),
];
