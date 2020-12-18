import SerialPort from "@serialport/stream";
import { MspParser } from "./parser";
import WriteBuffer from "./writebuffer";

export type MspInfo = {
  mspProtocolVersion: number;
  apiVersion: string;
};

export type ExecutionLocks = Record<number, Promise<void>>;

export type MspRequest = {
  close: () => void;
  response: Promise<ArrayBuffer>;
};

export type Connection = {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<string, MspRequest>;
  bytesWritten: number;
  bytesRead: number;
  packetErrors: number;
  mspInfo: MspInfo;
};

export type ConnectionOptions = {
  baudRate?: number;
};

export type OnCloseCallback = () => void;

export type OpenConnectionFunction = {
  (
    port: string,
    options?: ConnectionOptions,
    onClose?: OnCloseCallback
  ): Promise<void>;
  (port: string, onClose?: OnCloseCallback): Promise<void>;
};

export type MspCommand = {
  code: number;
  data?: WriteBuffer | Buffer;
  timeout?: number;
};
