import * as api from "@betaflight/api";
import * as mockedApi from "./mock/api";
import * as connections from "./connections";
import * as mockedConnections from "./mock/connections";

export type Context = {
  api: typeof api;
  connections: typeof connections;
  port: string;
};

export const mockedContext = (): Context => ({
  api: mockedApi,
  connections: mockedConnections,
  port: "",
});

export default (): Context => ({ api, connections, port: "" });
