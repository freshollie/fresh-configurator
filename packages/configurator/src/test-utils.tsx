import React from "react";
import { render as renderFunction, RenderResult } from "@testing-library/react";
import { ThemeProvider } from "./theme";

const AllTheProviders: React.FC = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const customRender = (
  ui: Parameters<typeof renderFunction>[0],
  options?: Parameters<typeof renderFunction>[1]
): RenderResult => renderFunction(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
