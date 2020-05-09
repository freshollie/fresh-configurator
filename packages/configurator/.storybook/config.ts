import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "themeprovider-storybook";
import AutoTheme from "./AutoTheme";

const themes = [
  {
    name: "Light",
    dark: false,
  },
  {
    name: "Dark",
    dark: true,
  },
];

addDecorator(withThemesProvider(themes, AutoTheme));
