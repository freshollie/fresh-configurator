import SerialPort from "serialport";
import { MspParser } from "./parser";

export interface Connection {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<string, Promise<ArrayBuffer> | undefined>;
  bytesWritten: number;
  bytesRead: number;
  packetErrors: number;
}

export interface ConnectionOptions {
  baudRate?: number;
}

export type OnCloseCallback = () => void;

export interface OpenFunction {
  (
    port: string,
    options?: ConnectionOptions,
    onClose?: OnCloseCallback
  ): Promise<void>;
  (port: string, onClose?: OnCloseCallback): Promise<void>;
}

export interface MspCommand {
  code: number;
  data?: Buffer;
  timeout?: number;
}
