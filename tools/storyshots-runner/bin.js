#!/usr/bin/env node

const importJsx = require("import-jsx");
const meow = require("meow");

const { run } = importJsx("./runner");

const rootDir = process.cwd();

(async () => {
  const cli = meow(
    `
	Usage
	  $ storyshots-runner <Stories filter>

	Options
      --snapshotsDirectory The directory which should be used to store snapshots
      --url Storybook directory
      --command E.G. start-storybook -p 9009
      --workers Number of workers to process screenshots
      --commandTimeout (in seconds)
      --update Commit the snapshot updates
`,
    {
      flags: {
        url: {
          type: "string",
        },
        command: {
          type: "string",
          isRequired: false,
        },
        commandTimeout: {
          type: "number",
          default: 120,
        },
        snapshotsDirectory: {
          type: "string",
          alias: "r",
          default: "__image_snapshots__",
        },
        diffFolder: {
          type: "string",
          alias: "d",
          default: "__diff_output__",
        },
        update: {
          type: "boolean",
          alias: "u",
          default: false,
        },
        workers: {
          type: "number",
          alias: "w",
          isRequired: false,
        },
      },
    }
  );
  const filter = cli.input[0];
  const {
    snapshotsDirectory,
    command,
    url,
    directory,
    commandTimeout,
    update,
    workers,
    diffFolder,
  } = cli.flags;
  process.exit(
    await run({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      url: url || `file://${rootDir}/${directory}`,
      snapshotsDirectory: `${rootDir}/${snapshotsDirectory}/`,
      command,
      commandTimeout: commandTimeout * 1000,
      include: filter,
      update,
      numWorkers: workers,
      diffFolder,
    })
  );
})();
