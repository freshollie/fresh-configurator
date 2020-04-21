import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "themeprovider-storybook";
import { ThemeProvider } from "../src/theme";

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

addDecorator(withThemesProvider(themes, ThemeProvider));
