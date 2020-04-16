// Allow all components of styled-components to be themed.
// Used in src/theme.tsx
//
// Credits: https://gist.github.com/chrislopresto/490ef5692621177ac71c424543702bbb
import * as React from "react";
import { ThemedStyledComponentsModule } from "styled-components";

declare module "styled-components" {
  export type ThemedStyledComponentsModule<T> = {
    createGlobalStyle(
      strings: TemplateStringsArray,
      ...interpolations: SimpleInterpolation[]
    ): React.ComponentClass;
  };

  export function createGlobalStyle(
    strings: TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ): React.ComponentClass;
}
