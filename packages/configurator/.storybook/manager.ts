import "themeprovider-storybook/register";

import { create } from "@storybook/theming";
import { addons } from "@storybook/addons";

addons.setConfig({
  theme: create({
    base: "dark",

    colorPrimary: "#ffbb00",
    colorSecondary: "#3d3f3e",
    barSelectedColor: "#ffbb00",

    fontBase: '"Open Sans", "Segoe UI", Tahoma, sans-serif',
    fontCode: "monospace",

    textColor: "white",
    textInverseColor: "white",

    brandTitle: "Betaflight components",
    brandImage: "./logo.svg",
  }),
});
