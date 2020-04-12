import * as msp from "@fresh/msp";
import * as connections from "./connections";

export interface Context {
  msp: typeof msp;
  connections: typeof connections;
}

export default (): Context => ({ msp, connections });
