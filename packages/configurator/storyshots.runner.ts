import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

initStoryshots({
  suite: "Component snapshots",
  test: imageSnapshot({
    storybookUrl: !process.env.STORYBOOK_PORT
      ? `file://${path.resolve(__dirname, "../storybook-static")}`
      : `http://localhost:${process.env.STORYBOOK_PORT}`,
  }),
});
