import initStoryshots from "@storybook/addon-storyshots";
import storyshotsHelper from "./storyshots-helper";

initStoryshots({
  suite: "light",
  renderer: () => null,
  test: storyshotsHelper({ dark: false }),
});
