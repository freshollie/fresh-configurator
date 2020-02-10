import React from "react";
import { ThemeProvider } from "../src/theme";

const ThemeDecorator = (storyFn: () => JSX.Element) => (
  <ThemeProvider>{storyFn()}</ThemeProvider>
);

export default ThemeDecorator;
