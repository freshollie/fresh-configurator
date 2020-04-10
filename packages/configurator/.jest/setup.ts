/* eslint-disable no-console */
import "@testing-library/jest-dom";
import "jest-styled-components";

const origConsole = console.warn;

console.warn = function newWarn(message: string) {
  if (
    !message.startsWith(
      "Found @client directives in a query but no ApolloClient resolvers were specified"
    )
  ) {
    // eslint-disable-next-line prefer-rest-params
    origConsole.call(this, ...arguments);
  }
};
