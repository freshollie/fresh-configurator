/**
 * Bootstrap electron with ts-node to allow us to run
 * our main without compiling it
 */
// eslint-disable-next-line import/no-extraneous-dependencies
require("ts-node").register();
require("./src/main");
