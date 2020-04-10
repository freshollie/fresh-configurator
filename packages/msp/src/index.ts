/* eslint-disable import/first */
process.env.DEBUG = "connection";
export * from "./device";
export {
  ports,
  connections,
  isOpen,
  open,
  close,
  bytesRead,
  bytesWritten,
  packetErrors,
  apiVersion,
} from "./serial/connection";
