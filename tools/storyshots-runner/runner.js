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
const { PendingXHR } = require("pending-xhr-puppeteer");
const os = require("os");

const numCpus = os.cpus().length;

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

const ensureDir = (dir) =>
  new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          resolve();
        } else {
          reject(err);
        }
      } else resolve();
    });
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
  diffFolder = "__diff_output__",
  mockDate = "2020-07-07T09:09:09Z",
  numWorkers = numCpus < 3 ? numCpus : 4,
  command,
  commandTimeout,
  include = "",
  update,
}) => {
  let exitCode = 0;
  const diffDirectory = path.join(snapshotsDirectory, diffFolder);
  await ensureDir(snapshotsDirectory);

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
  const storiesBrowser = await new StoriesBrowser(connection, {
    launchOptions: {
      executablePath: CI ? "google-chrome-stable" : undefined,
      args: ["--no-sandbox"],
    },
  }).boot();

  const shutdown = async () => {
    await Promise.all([connection.disconnect(), storiesBrowser.close()]);
  };
  process.on("SIGINT", shutdown);
  // process.on("SIGKILL", shutdown);

  // Item in stories has name, kind and id of the corresponding story
  const stories = await storiesBrowser.getStories();

  const tasks = [
    ...stories.map((story) => ({ ...story, dark: false })),
    ...stories.map((story) => ({ ...story, dark: true })),
  ]
    .sort((a, b) => a.kind.localeCompare(b.kind))
    .filter((task) =>
      `${task.kind}-${task.story}`.toLowerCase().includes(include.toLowerCase())
    );

  // Launch Puppeteer browsers to visit each story's preview window(iframe.html)
  const workers = await Promise.all(
    new Array(numWorkers).fill(0).map((i) =>
      new StoryPreviewBrowser(connection, i, {
        launchOptions: {
          executablePath: CI ? "google-chrome-stable" : undefined,
          headless: true,
          args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=none"],
        },
      }).boot()
    )
  );

  await Promise.all(
    workers.map((worker) =>
      worker.page.setViewport({ width: 960, height: 640 })
    )
  );

  const executor = async (worker, task) => {
    const pendingXHR = new PendingXHR(worker.page);
    try {
      const changeTheme = await worker.page.evaluate(
        (isDark, mockedDate) => {
          if (!window.__datemocked__) {
            window.__datemocked__ = true;
            const OldDate = Date;
            // eslint-disable-next-line func-names
            window.Date = function (...options) {
              if (options.length === 0) {
                return new OldDate(...options);
              }
              return new OldDate(mockedDate);
            };
            window.Date.now = OldDate.now;
          }
          const wasDark = !!window.__dark__;
          window.__dark__ = isDark;
          window.__snapshot__ = true;
          if (window.snaps) {
            window.snaps.teardown();
          }
          return isDark !== wasDark;
        },
        task.dark,
        mockDate
      );

      // Display story in the worker's preview window
      await worker.setCurrentStory(task, { forceRerender: changeTheme });

      // Wait for UI framework updating DOM
      await new MetricsWatcher(worker.page).waitForStable();
      await worker.page.evaluate(async () => {
        await window.snaps.waitForAnimations();
      });

      // wait for all to be loaded, and then wait for the next cycle before screenshotting
      await pendingXHR.waitForAllXhrFinished();

      const newScreenshot = PNG.sync.read(
        await worker.page.screenshot({
          encoding: "binary",
          omitBackground: true,
        })
      );

      const existing = await readExistingSnapshot(
        snapshotPath(snapshotsDirectory, task)
      ).catch(() => undefined);

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
            threshold: 0.2,
          }
        );
        const pixels = width * height;
        const percentage = (difference / pixels) * 100;

        if (percentage > 0.5) {
          if (!update) {
            const diffSnap = snapshotPath(diffDirectory, task);
            await ensureDir(diffDirectory);
            await writeSnapshot(diff, diffSnap);
            return {
              story: task,
              failed: true,
              message: `${difference} pixels difference detected between snapshots, see ${diffSnap} for more details`,
            };
          }
          shouldWrite = true;
        }
      }

      let newPath;
      if (shouldWrite || !existing) {
        if (CI) {
          return {
            story: task,
            failed: true,
            message:
              "Refusing to create a new snapshot as running in CI, run locally to create a new shapshot",
          };
        }
        newPath = snapshotPath(snapshotsDirectory, task);
        await writeSnapshot(newScreenshot, newPath);
        return {
          story: task,
          failed: false,
          message: `New snapshot written to ${newPath}`,
        };
      }
      return {
        story: task,
        failed: false,
      };
    } catch (e) {
      return { story: task, failed: true, message: e.message };
    } finally {
      pendingXHR.removePageListeners();
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
        const start = new Date().getTime();
        const result = await executor(worker, task);
        // mark complete (value)
        const end = new Date().getTime();
        console.log(`FINISHED (${end - start}ms)`, task);
        return result;
      }
    );

    // `createExecutionService` register tasks but does not kick them.
    // Tasks in queue start via calling `.execute()`.
    const results = await service.execute();

    results.forEach(({ story, failed, message }) =>
      console.log(`${story.id}: ${failed ? "failed" : "passed"} - ${message}`)
    );
    if (results.some((result) => result.failed)) {
      exitCode = 1;
    }
  } finally {
    await storiesBrowser.close();
    await Promise.all(workers.map((worker) => worker.close()));
    await connection.disconnect();
  }
  return exitCode;
};

module.exports = {
  run,
};
