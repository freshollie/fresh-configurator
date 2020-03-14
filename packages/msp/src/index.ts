export * from "./device";
export {
  ports,
  connections,
  isOpen,
  open,
  close,
  bytesRead,
  bytesWritten,
  packetErrors
} from "./serial/connection";
