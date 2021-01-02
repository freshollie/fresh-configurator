const {
  StorybookConnection,
  StoriesBrowser,
  StoryPreviewBrowser,
  MetricsWatcher,
  createExecutionService,
  Logger,
} = require("storycrawler");
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");

const CI = !!process.env.CI;
const readExistingSnapshot = (snapshotPath) =>
  new Promise((resolve, reject) => {
    const image = new PNG();
    const readStream = fs.createReadStream(snapshotPath);

    readStream.on("error", (e) => reject(e));
    readStream
      .pipe(image)
      .on("parsed", () => {
        resolve(image);
      })
      .on("error", (e) => reject(e));
  });

const writeSnapshot = (image, snapshotPath) =>
  new Promise((resolve, reject) => {
    fs.writeFile(snapshotPath, PNG.sync.write(image), (e) => {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });

const snapshotPath = (snapshotDir, { id, dark }) =>
  path.join(snapshotDir, `${dark ? "dark" : "light"}-${id}.png`);

// eslint-disable-next-line import/prefer-default-export
const run = async ({
  url,
  snapshotsDirectory,
  numWorkers = 4,
  command,
  commandTimeout,
  include = "",
  update,
}) => {
  try {
    fs.mkdirSync(snapshotsDirectory);
  } catch (e) {
    // directory already exists, ignore
  }

  // Connect to the target Storybook server.
  const connection = await new StorybookConnection(
    {
      storybookUrl: url,
      serverCmd: command,
      serverTimeout: commandTimeout,
    },
    new Logger("verbose")
  ).connect();

  // Launch Puppeteer process to fetch stories info.
  const storiesBrowser = await new StoriesBrowser(connection).boot();

  const shutdown = async () => {
    await Promise.all([connection.disconnect(), storiesBrowser.close()]);
  };
  process.on("SIGINT", shutdown);

  // Item in stories has name, kind and id of the corresponding story
  const stories = await storiesBrowser.getStories();

  const tasks = [
    ...stories.map((story) => ({ ...story, dark: false })),
    ...stories.map((story) => ({ ...story, dark: true })),
  ]
    .sort((a, b) => a.kind.localeCompare(b.kind))
    .filter((task) => task.kind.toLowerCase().includes(include.toLowerCase()));

  // Launce Puppeteer browsers to visit each story's preview window(iframe.html)
  const workers = await Promise.all(
    new Array(numWorkers)
      .fill(0)
      .map((i) => new StoryPreviewBrowser(connection, i).boot())
  );

  const executor = async (worker, task) => {
    try {
      await worker.page.evaluate(
        (isDark) => {
          // eslint-disable-next-line no-underscore-dangle, no-undef
          window.__dark__ = isDark;
          // eslint-disable-next-line no-underscore-dangle, no-undef
          window.__snapshot__ = true;
        },
        [task.dark]
      );
      // Display story in the worker's preview window
      await worker.setCurrentStory(task);

      // Wait for UI framework updating DOM
      await new MetricsWatcher(worker.page).waitForStable();

      const existing = await readExistingSnapshot(
        snapshotPath(snapshotsDirectory, task)
      ).catch(() => undefined);

      const newScreenshot = PNG.sync.read(
        await worker.page.screenshot({
          encoding: "binary",
        })
      );

      let shouldWrite = false;
      // compare if we have an existing snapshot
      if (existing) {
        const { width, height } = newScreenshot;
        const diff = new PNG({ width, height });

        const difference = pixelmatch(
          existing.data,
          newScreenshot.data,
          diff.data,
          width,
          height,
          {
            threshold: 0.1,
          }
        );

        if (difference > 0) {
          if (!update) {
            return {
              story: task,
              failed: true,
              message: `${difference} pixels difference detected between snapshots, see diff for more details`,
            };
          }
          shouldWrite = true;
        }
      }

      if (shouldWrite || !existing) {
        if (CI) {
          return {
            story: task,
            failed: true,
            message:
              "Refusing to create a new snapshot as running in CI, run locally to create a new shapshot",
          };
        }
        await writeSnapshot(
          newScreenshot,
          snapshotPath(snapshotsDirectory, task)
        );
      }
      return { story: task, failed: false, new: true };
    } catch (e) {
      return { story: task, failed: true, message: e.message };
    }
  };

  try {
    // `createExecutionService` creates a queue of the tasks for each story.
    const service = createExecutionService(
      workers,
      tasks,
      (task) => async (worker) => {
        // mark starting
        console.log("WORKING ON", task);
        const result = await executor(worker, task);
        // mark complete (value)
        console.log("FINISHED", task);
        return result;
      }
    );

    // `createExecutionService` register tasks but does not kick them.
    // Tasks in queue start via calling `.execute()`.
    const results = await service.execute();

    results.forEach(({ story, failed, message }) =>
      console.log(`${story.id}: ${failed ? "failed" : "passed"} - ${message}`)
    );
  } finally {
    await storiesBrowser.close();
    await Promise.all(workers.map((worker) => worker.close()));
    await connection.disconnect();
  }
};

module.exports = {
  run,
};
