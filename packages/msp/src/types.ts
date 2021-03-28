import SerialPort from "@serialport/stream";
import MspDataView from "./dataview";
import { MspParser } from "./parser";

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
  data?: number[] | Buffer;
  timeout?: number;
  match?: (data: MspDataView) => boolean;
};

export type PortInfo = {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
};
