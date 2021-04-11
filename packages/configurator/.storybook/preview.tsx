import React from "react";
import type { DecoratorFn } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { themes } from "@storybook/theming";
import createTheme from "bumbag/theme";
import AutoTheme from "./AutoTheme";

// eslint-disable-next-line import/prefer-default-export
export const decorators: DecoratorFn[] = [
  (renderStory) => <AutoTheme>{renderStory()}</AutoTheme>,
];

// eslint-disable-next-line prefer-destructuring, @typescript-eslint/no-explicit-any
const palette: any = createTheme().palette;

export const parameters = {
  darkMode: {
    dark: {
      ...themes.dark,
      appBg: palette.modes.dark.default,
      barBg: palette.modes.dark.default,
      barSelectedColor: palette.modes.dark.primary,
      colorPrimary: palette.modes.dark.primary,
      colorSecondary: palette.modes.dark.secondary,
      textColor: palette.modes.dark.text,
      textColorInverted: palette.modes.dark.textInverted,

      fontBase:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontCode: "monospace",
    },
    light: {
      ...themes.light,
      appBg: palette.default,
      barBg: palette.default,
      barSelectedColor: palette.primary,
      colorPrimary: palette.primary,
      colorSecondary: palette.secondary,
      textColor: palette.text,
      textColorInverted: palette.textInverted,

      fontBase:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontCode: "monospace",
    },
  },
};
