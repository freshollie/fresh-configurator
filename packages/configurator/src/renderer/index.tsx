import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Box, Image, Provider as BumbagProvider } from "bumbag";
import App from "./App";
import { createClient } from "./gql/client";
import theme from "./theme";
import OnPaintNotifier from "./OnPaintNotifier";
import FullScreenSpinner from "./components/FullScreenSpinner";
import { SupaflyLogo } from "./logos";

const Fallback: React.FC<FallbackProps> = ({ error }) => (
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
      onClick={() => {
        window.location.reload();
      }}
    >
      Reload
    </button>
  </div>
);

const ApolloLoader: React.FC = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<unknown>>();
  useEffect(() => {
    createClient().then(setClient);
  }, []);

  if (!client) {
    return (
      <FullScreenSpinner
        image={
          <Image
            loading="eager"
            referrerPolicy=""
            src={SupaflyLogo}
            width="800px"
          />
        }
        text="Initialising"
      />
    );
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <BumbagProvider theme={theme} colorMode="light">
        <Box minHeight="100vh">
          <ApolloLoader>
            <OnPaintNotifier channel="paint" />
            <App />
          </ApolloLoader>
        </Box>
      </BumbagProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("app")
);
