/* eslint-disable import/no-extraneous-dependencies */
/**
 * Bootstrap electron with ts-node to allow us to run
 * our main without compiling it
 */
process.env.TS_NODE_PROJECT = `${__dirname}/tsconfig.dev.json`;

require("ts-node").register();
require("tsconfig-paths").register();
require("./src/main");
