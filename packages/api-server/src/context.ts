import * as api from "@betaflight/api";
import * as connections from "./connections";

export interface Context {
  api: typeof api;
  connections: typeof connections;
}

export default (): Context => ({ api, connections });
