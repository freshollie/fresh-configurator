import { create } from "@storybook/theming";
import { addons } from "@storybook/addons";

addons.setConfig({
  theme: create({
    base: "dark",

    colorPrimary: "#574feb",
    colorSecondary: "#9e46d8",
    barSelectedColor: "#ffbb00",

    fontBase:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontCode: "monospace",

    textColor: "white",
    textInverseColor: "white",

    brandTitle: "Betaflight components",
    brandImage: "./logo.svg",
  }),
});
