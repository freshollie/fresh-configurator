import React from "react";
import type { DecoratorFn } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { themes } from "@storybook/theming";
import { Palette } from "bumbag/types/props";
import createPalette from "bumbag/theme/palette";
import AutoTheme from "./AutoTheme";

// eslint-disable-next-line import/prefer-default-export
export const decorators: DecoratorFn[] = [
  (renderStory) => <AutoTheme>{renderStory()}</AutoTheme>,
];

// eslint-disable-next-line prefer-destructuring, @typescript-eslint/no-explicit-any
const palette = createPalette({});
const darkPalette = palette.modes.dark as typeof palette &
  Record<Palette, string>;
const lightPalette = palette as typeof palette & Record<Palette, string>;

export const parameters = {
  darkMode: {
    dark: {
      ...themes.dark,
      appBg: darkPalette.black,
      barBg: darkPalette.default,
      barSelectedColor: darkPalette.primary,
      colorPrimary: darkPalette.primary,
      colorSecondary: darkPalette.secondary,
      textColor: darkPalette.text,
      textColorInverted: darkPalette.textInverted,

      fontBase:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontCode: "monospace",
    },
    light: {
      ...themes.light,
      appBg: lightPalette.default,
      barBg: lightPalette.default,
      barSelectedColor: lightPalette.primary,
      colorPrimary: lightPalette.primary,
      colorSecondary: lightPalette.secondary,
      textColor: palette.text,
      textColorInverted: palette.textInverted,

      fontBase:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontCode: "monospace",
    },
  },
};
