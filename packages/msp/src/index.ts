process.env.DEBUG = "parser";

export * from "./device";
export { ports, connections, isOpen, open, close } from "./serial/connection";
