import React from "react";
import { render as renderFunction, RenderResult } from "@testing-library/react";
import { Provider } from "bumbag";
import theme from "./theme";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

const AllTheProviders: React.FC = ({ children }) => (
  <Provider theme={theme}>{children}</Provider>
);

const customRender = (
  ui: Parameters<typeof renderFunction>[0],
  options?: Parameters<typeof renderFunction>[1]
): RenderResult => renderFunction(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
