import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import App from "./App";
import client from "./gql/client";
import { ThemeProvider } from "./theme";

const Fallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
  <div
    role="alert"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <h1>Something went wrong :(</h1>
    <pre>{error.stack}</pre>
    <button
      type="button"
      onClick={async () => {
        await client.resetStore();
        resetErrorBoundary();
      }}
    >
      Reload
    </button>
  </div>
);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("app")
);
