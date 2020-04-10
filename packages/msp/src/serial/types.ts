import SerialPort from "serialport";
import { MspParser } from "./parser";
import WriteBuffer from "./writebuffer";
import codes from "./codes";

export interface MspInfo {
  mspProtocolVersion: number;
  apiVersion: string;
}

export type Codes = typeof codes[keyof typeof codes];

export type ExecutionLocks = Record<Codes, Promise<void> | undefined>;

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
  code: Codes;
  data?: WriteBuffer | Buffer;
  timeout?: number;
}
