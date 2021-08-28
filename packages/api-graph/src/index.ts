import { makeExecutableSchema } from "@graphql-tools/schema";
import { startTicks } from "./mock/api";
import graph from "./graph";
import context, { mockedContext } from "./context";

export const schema = makeExecutableSchema(graph);
export {
  mockedContext as mockedDeviceContext,
  context,
  startTicks as startMockDevice,
};
