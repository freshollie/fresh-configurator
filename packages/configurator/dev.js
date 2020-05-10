/* eslint-disable import/no-extraneous-dependencies */
/**
 * Bootstrap electron with ts-node to allow us to run
 * our main without compiling it
 */
const path = require("path");

require("ts-node").register({
  compilerOptions: { module: "commonjs" },
  project: path.join(__dirname, "tsconfig.json"),
});
require("./src/main");
