/**
 * This is the base theme to all components of this APP
 */
import React, { useContext } from "react";
import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

import openSansLight2 from "./fonts/opensans-light-webfont.woff2";
import openSansLight from "./fonts/opensans-light-webfont.woff";
import openSansRegular2 from "./fonts/opensans-regular-webfont.woff2";
import openSansRegular from "./fonts/opensans-regular-webfont.woff";
import openSansItalic2 from "./fonts/opensans-italic-webfont.woff2";
import openSansItalic from "./fonts/opensans-italic-webfont.woff";
import openSansSemibold2 from "./fonts/opensans-semibold-webfont.woff2";
import openSansSemibold from "./fonts/opensans-semibold-webfont.woff";
import openSansBold2 from "./fonts/opensans-bold-webfont.woff2";
import openSansBold from "./fonts/opensans-bold-webfont.woff";
import openSansBoldItalic2 from "./fonts/opensans-bolditalic-webfont.woff2";
import openSansBoldItalic from "./fonts/opensans-bolditalic-webfont.woff";

export const lightColors = {
  accent: "#ffbb00",
  secondary: "#3d3f3e",
  borderAccent: "#ffbb2a",
  error: "red",
  subtleAccent: "silver",
  quietText: "#ffffff",
  quietHeader: "#828885",
  defaultText: "#303030",
  subtleText: "#c0c0c0",
  mutedText: "#616161",
  boxBackground: "#ffffff",
  alternativeBackground: "#f9f9f9",
  sideBackground: "#ffffff",
  ledAccent: "#adadad",
  ledBackground: "#e9e9e9",
  gimbalBackground: "#eee",
  gimbalCrosshair: "silver",
  switcherysecond: "#c4c4c4",
};

type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  accent: "#ffbb00",
  secondary: "#3d3f3e",
  borderAccent: "#ffbb2a",
  error: "red",
  subtleAccent: "#9c9c9c",
  quietText: "#ffffff",
  quietHeader: "#bf8606",
  defaultText: "#ffffff",
  subtleText: "#c0c0c0",
  mutedText: "#d6d6d6",
  boxBackground: "#3a3a3a",
  alternativeBackground: "#4e4e4e",
  sideBackground: "#404040",
  ledAccent: "#6e6e6e",
  ledBackground: "#424242",
  gimbalBackground: "#9c9c9c",
  gimbalCrosshair: "#d6d6d6",
  switcherysecond: "#858585",
};

type Theme = {
  dark: boolean;
  colors: ThemeColors;
};

const {
  default: styled,
  createGlobalStyle,
  ThemeProvider,
  ThemeContext,
  css,
} = styledComponents as ThemedStyledComponentsModule<Theme>;

const GlobalStyle = createGlobalStyle`
  * {
    outline: none;
  }

  @font-face {
    font-family: "Open Sans";
    src: url(${openSansLight2}) format("woff2"),
      url(${openSansLight}) format("woff");
    font-weight: 300;
    font-style: normal;
  }
  /* Light Italic? */
  @font-face {
    font-family: "Open Sans";
    src: url(${openSansRegular2}) format("woff2"),
      url(${openSansRegular}) format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "Open Sans";
    src: url(${openSansItalic2}) format("woff2"),
      url(${openSansItalic}) format("woff");
    font-weight: normal;
    font-style: italic;
  }
  @font-face {
    font-family: "Open Sans";
    src: url(${openSansSemibold2}) format("woff2"),
      url(${openSansSemibold}) format("woff");
    font-weight: 600;
    font-style: normal;
  }
  /* Semi-Bold Italic */
  @font-face {
    font-family: "Open Sans";
    src: url(${openSansBold2}) format("woff2"),
      url(${openSansBold}) format("woff");
    font-weight: bold;
    font-style: normal;
  }
  @font-face {
    font-family: "Open Sans";
    src: url(${openSansBoldItalic2}) format("woff2"),
      url(${openSansBoldItalic}) format("woff");
    font-weight: bold;
    font-style: italic;
  }

  body {
    font-family: "Open Sans", "Segoe UI", Tahoma, sans-serif;
    font-size: 12px;
    margin: 0px;
    padding: 0px;
    color: ${({ theme }) => theme.colors.defaultText};
    background-color: ${({ theme }) =>
      theme.dark ? theme.colors.secondary : "white"};
  }

  .content {
    padding: 20px;
  }
`;

export default styled;

const BetaflightThemeProvider: React.FC<{ theme?: { dark: boolean } }> = ({
  theme,
  children,
}) => (
  <>
    <ThemeProvider
      theme={{
        dark: !!theme?.dark,
        colors: theme?.dark ? darkColors : lightColors,
      }}
    >
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  </>
);

const useTheme = (): Theme => useContext<Theme>(ThemeContext);

export {
  css,
  useTheme,
  BetaflightThemeProvider as ThemeProvider,
  ThemeContext,
};
