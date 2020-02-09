import React from "react";
import styled, {
  createGlobalStyle,
  css as defaultCss,
  ThemedStyledInterface,
  ThemedCssFunction,
  ThemeProvider as DefaultThemeProvider
} from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', 'Segoe UI', Tahoma, sans-serif;
    font-size: 12px;
    color: #303030;
    background-color: #3d3f3e;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
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
  switcherysecond: "#c4c4c4"
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
  switcherysecond: "#c4c4c4"
};

export default styled as ThemedStyledInterface<Theme>;
export const css = defaultCss as ThemedCssFunction<Theme>;

export const ThemeProvider: React.FC<{ dark?: boolean }> = ({
  dark,
  children
}) => (
  <>
    <GlobalStyle />
    <DefaultThemeProvider
      theme={{ dark: !!dark, colors: dark ? darkColors : lightColors }}
    >
      {children}
    </DefaultThemeProvider>
  </>
);
