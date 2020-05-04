/* eslint-disable import/no-extraneous-dependencies */
/**
 * Bootstrap electron with ts-node to allow us to run
 * our main without compiling it
 */
require("ts-node").register({
  compilerOptions: { module: "commonjs" },
});
require("./src/main");
