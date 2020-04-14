import SerialPort from "@serialport/stream";
import { MspParser } from "./parser";
import WriteBuffer from "./writebuffer";

export interface MspInfo {
  mspProtocolVersion: number;
  apiVersion: string;
}

export type ExecutionLocks = Record<number, Promise<void> | undefined>;

export interface Connection {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<string, Promise<ArrayBuffer> | undefined>;
  bytesWritten: number;
  bytesRead: number;
  packetErrors: number;
  mspInfo: MspInfo;
}

export interface ConnectionOptions {
  baudRate?: number;
}

export type OnCloseCallback = () => void;

export interface OpenConnectionFunction {
  (
    port: string,
    options?: ConnectionOptions,
    onClose?: OnCloseCallback
  ): Promise<void>;
  (port: string, onClose?: OnCloseCallback): Promise<void>;
}

export interface MspCommand {
  code: number;
  data?: WriteBuffer | Buffer;
  timeout?: number;
}
