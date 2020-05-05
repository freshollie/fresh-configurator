import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

initStoryshots({
  suite: "Component snapshots",
  test: imageSnapshot({
    chromeExecutablePath: process.env.PUPPETEER_EXEC_PATH,
    storybookUrl: !process.env.STORYBOOK_PORT
      ? `file://${path.resolve(__dirname, "storybook-static")}`
      : `http://localhost:${process.env.STORYBOOK_PORT}`,
    getMatchOptions: () => ({
      failureThreshold: 2,
      failureThresholdType: "pixel",
    }),
    getScreenshotOptions: () => ({ encoding: "base64", omitBackground: true }),
    customizePage: (page) => page.setViewport({ width: 960, height: 640 }),
    afterScreenshot: ({ context: { kind, story } }) =>
      process.stdout.write(`Tested ${kind}:${story}\n`),
  }),
});
