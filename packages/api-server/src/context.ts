import * as api from "@betaflight/api";
import * as connections from "./connections";

export interface Context {
  msp: typeof api;
  connections: typeof connections;
}

export default (): Context => ({ msp: api, connections });
