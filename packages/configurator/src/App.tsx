import React, { useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "wouter";
import ConnectionProvider from "./context/ConnectionProvider";
import Blackbox from "./pages/configuration/Blackbox";
import General from "./pages/configuration/General";
import Overview from "./pages/configuration/Overview";
import Radio from "./pages/configuration/Radio";
import Home from "./pages/Home";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const currentLocation = (): string =>
  window.location.hash.replace(/^#/, "") || "/";

const navigate = (to: string): string => {
  console.log(to);
  window.location.hash = to;
  return window.location.hash;
};

const useHashLocation = (): [string, typeof navigate] => {
  const [loc, setLoc] = useState(currentLocation());

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = (): void => setLoc(currentLocation());

    // subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return [loc, navigate];
};

const App: React.FC = () => (
  <Router hook={useHashLocation}>
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/connections/:connectionId*">
        <ConnectionProvider>
          <Switch>
            <Route path="/connections/:connectionId/">
              <Overview />
            </Route>
            <Route path="/connections/:connectionId/general">
              <General />
            </Route>
            <Route path="/connections/:connectionId/radio">
              <Radio />
            </Route>
            <Route path="/connections/:connectionId/blackbox">
              <Blackbox />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </ConnectionProvider>
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Router>
);

export default App;
