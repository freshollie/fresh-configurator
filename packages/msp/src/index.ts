export * from "./device";
export {
  ports,
  connections,
  isOpen,
  open,
  initialise,
  close,
  bytesRead,
  bytesWritten,
  packetErrors,
  apiVersion
} from "./serial/connection";
export { Features } from "./features";
