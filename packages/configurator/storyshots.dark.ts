import initStoryshots from "@storybook/addon-storyshots";
import storyshotsHelper from "./storyshots-helper";

initStoryshots({
  suite: "dark",
  renderer: () => null,
  test: storyshotsHelper({ dark: true }),
});
