/**
 * This is the base theme to all components of this APP
 */
import React, { useContext } from "react";
import styled, {
  createGlobalStyle,
  css as defaultCss,
  ThemedStyledInterface,
  ThemedCssFunction,
  ThemeProvider as DefaultThemeProvider,
  ThemeContext,
} from "styled-components";

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
    color: #303030;
    background-color: #3d3f3e;
    margin: 0px;
    padding: 0px;
  }

  .content {
    padding: 20px;
  }
`;

interface ThemeColors {
  accent: string;
  error: string;
  subtleAccent: string;
  quietText: string;
  quietHeader: string;
  defaultText: string;
  subtleText: string;
  mutedText: string;
  boxBackground: string;
  alternativeBackground: string;
  sideBackground: string;
  ledAccent: string;
  ledBackground: string;
  gimbalBackground: string;
  gimbalCrosshair: string;
  switcherysecond: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  accent: "#ffbb00",
  error: "red",
  subtleAccent: "silver",
  quietText: "#ffffff",
  quietHeader: "#828885",
  defaultText: "#000000",
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

const darkColors: ThemeColors = {
  accent: "#ffbb00",
  error: "red",
  subtleAccent: "silver",
  quietText: "#ffffff",
  quietHeader: "#828885",
  defaultText: "#000000",
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

export default styled as ThemedStyledInterface<Theme>;
export const css = defaultCss as ThemedCssFunction<Theme>;

export const ThemeProvider: React.FC<{ theme?: { dark: boolean } }> = ({
  theme,
  children,
}) => (
  <>
    <GlobalStyle />
    <DefaultThemeProvider
      theme={{
        dark: !!theme?.dark,
        colors: theme?.dark ? darkColors : lightColors,
      }}
    >
      {children}
    </DefaultThemeProvider>
  </>
);

export const useTheme = (): Theme => useContext<Theme>(ThemeContext);
