import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import client from "./gql/client";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("app")
);
