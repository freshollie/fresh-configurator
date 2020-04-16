import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "themeprovider-storybook";
import { ThemeProvider } from "../src/theme";

const themes = [
  {
    name: "Light",
    backgroundColor: "#fff",
    dark: false,
  },
  {
    name: "Dark",
    backgroundColor: "#3d3f3e",
    dark: true,
  },
];

addDecorator(withThemesProvider(themes, ThemeProvider));
