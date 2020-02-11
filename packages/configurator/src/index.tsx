import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import client from "./gql/client";
import { ThemeProvider } from "./theme";

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("app")
);
