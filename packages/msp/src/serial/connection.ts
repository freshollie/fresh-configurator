/**
 * MSP Serial connections. This allows us to make multiple
 * serial connections, and enables execution of commands
 * on the given connection.
 *
 * The module handles making requests, and dealing with only
 * making one of the same request at a time.
 */

import SerialPort from "serialport";
import debug from "debug";
import MspDataView from "./dataview";
import { MspMessage, MspParser } from "./parser";
import { encodeMessageV2, encodeMessageV1 } from "./encoders";

import {
  Connection,
  MspCommand,
  ConnectionOptions,
  OpenFunction as OpenConnectionFunction,
  OnCloseCallback
} from "./types";
import codes from "./codes";

const log = debug("connection");

const connectionsMap: Record<string, Connection | undefined> = {};

/**
 * Execute the given MspCommand on the given port.
 *
 * Return the data received from the command
 */
export const execute = async (
  port: string,
  { code, data, timeout = 2500 }: MspCommand
): Promise<MspDataView> => {
  const connection = connectionsMap[port];
  if (!connection) {
    throw new Error(`${port} is not open`);
  }

  const { parser, serial, requests } = connection;

  const request =
    code > 254 ? encodeMessageV2(code, data) : encodeMessageV1(code, data);
  const requestKey = request.toString("utf-8");
  let dataRequest = requests[requestKey];

  // Prevent FC lockup by checking if this request is currently being performed
  // and if not, making the request
  if (!dataRequest) {
    dataRequest = new Promise((resolve, reject) => {
      // Throw an error if timeout is reached
      const timeoutId = setTimeout(() => {
        delete requests[requestKey];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        parser.off("data", onData);
        reject(new Error("Timed out during execution"));
      }, timeout);

      function onData(message: MspMessage): void {
        if (message.code === code) {
          if (message.crcError && connection) {
            connection.packetErrors += 1;
            return;
          }
          log(`${request.toJSON().data} response: ${message.data}`);

          delete requests[requestKey];
          clearTimeout(timeoutId);

          resolve(message.data);
          parser.off("data", onData);
        }
      }

      parser.on("data", onData);
    });

    requests[requestKey] = dataRequest;

    log(`Writing ${request.toJSON().data} to ${port}`);
    serial.write(request);
    connection.bytesWritten += Buffer.byteLength(request);
  }

  // make every DataView unique to each request, even though
  // they are accessing the same set of data
  return dataRequest.then(responseData => new MspDataView(responseData));
};

/**
 * Private, used for testing
 */
export const raw = (port: string): SerialPort | undefined =>
  connectionsMap[port]?.serial;

export const reset = (): void => {
  Object.keys(connectionsMap).forEach(port => {
    delete connectionsMap[port];
  });
};

export const ports = (): Promise<string[]> =>
  SerialPort.list().then(data => data.map(({ path }) => path));

/**
 * Close the given port
 */
export const close = async (port: string): Promise<void> => {
  const connection = connectionsMap[port];
  if (!connection) {
    return;
  }
  const { serial } = connection;

  const closePromise = new Promise(resolve => serial.on("close", resolve));
  serial.close();
  delete connectionsMap[port];

  await closePromise;
};

/**
 * Open a serial connection on the given
 * port, onClose will be emited once the
 * connection is closed
 */
export const open: OpenConnectionFunction = async (
  port: string,
  options?: ConnectionOptions | OnCloseCallback,
  onClose?: OnCloseCallback
) => {
  if (connectionsMap[port]) {
    throw new Error(`${port} is already open`);
  }

  // Handle overloads
  let onCloseCallback = onClose;
  let connectionOptions = options;

  if (typeof connectionOptions === "function") {
    onCloseCallback = connectionOptions;
    connectionOptions = {};
  }

  const serial = new SerialPort(port, {
    baudRate: 115200,
    ...connectionOptions,
    autoOpen: false
  });

  await new Promise((resolve, reject) => {
    serial.open(err => {
      if (err) {
        log(`error opening ${port}`);
        reject(err);
      } else {
        resolve();
      }
    });
  });

  const parser = serial.pipe(new MspParser());
  parser.setMaxListeners(1000000);

  const connection = {
    serial,
    parser,
    requests: {},
    bytesRead: 0,
    bytesWritten: 0,
    packetErrors: 0,
    mspInfo: {
      apiVersion: "0",
      mspProtocolVersion: 0
    }
  };

  connectionsMap[port] = connection;

  try {
    const response = await execute(port, { code: codes.MSP_API_VERSION });
    connection.mspInfo = {
      mspProtocolVersion: response.readU8(),
      apiVersion: `${response.readU8()}.${response.readU8()}.0`
    };
  } catch (e) {
    await close(port);
    throw new Error(`Could not read MSP version from ${port}`);
  }

  // valid connection, setup listeners
  serial.on("data", (data: Buffer) => {
    connection.bytesRead += Buffer.byteLength(data);
  });

  serial.on("error", () => {
    log(`${port} on error received`);
    close(port);
  });

  serial.on("close", () => {
    log(`${port} on close received`);
    close(port);
    onCloseCallback?.();
  });

  connection.bytesRead = 0;
  connection.bytesWritten = 0;
  connection.packetErrors = 0;
};

export const connections = (): string[] => Object.keys(connectionsMap);
export const isOpen = (port: string): boolean => !!connectionsMap[port];

export const bytesRead = (port: string): number =>
  connectionsMap[port]?.bytesRead ?? 0;

export const bytesWritten = (port: string): number =>
  connectionsMap[port]?.bytesWritten ?? 0;

export const packetErrors = (port: string): number =>
  connectionsMap[port]?.packetErrors ?? 0;

export const apiVersion = (port: string): string =>
  connectionsMap[port]?.mspInfo.apiVersion ?? "0.0.0";
