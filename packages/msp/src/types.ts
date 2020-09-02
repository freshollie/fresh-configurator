import SerialPort from "@serialport/stream";
import { Mutex } from "async-mutex";
import { MspParser } from "./parser";
import WriteBuffer from "./writebuffer";

export type MspInfo = {
  mspProtocolVersion: number;
  apiVersion: string;
};

export type ExecutionLocks = Record<number, Promise<void> | undefined>;

export type MspRequest<T> = {
  close: () => void;
  response: Promise<T>;
};

export type Connection = {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<
    string,
    MspRequest<ArrayBuffer> | MspRequest<string> | undefined
  >;
  bytesWritten: number;
  bytesRead: number;
  packetErrors: number;
  mspInfo: MspInfo;
  mode: "cli" | "data" | null;
  dataModeLock?: Promise<never>;
  cliLock: Mutex;
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
