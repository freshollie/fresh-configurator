/**
 * MSP Serial connections. This allows us to make multiple
 * serial connections, and enables execution of commands
 * on the given connection.
 *
 * The module handles making requests, and dealing with only
 * making one of the same request at a time.
 */

import SerialPort from "@serialport/stream";
import debug from "debug";
import { Mutex } from "async-mutex";
import MspDataView from "./dataview";
import { MspMessage, MspParser } from "./parser";
import { encodeMessageV2, encodeMessageV1 } from "./encoders";

import {
  Connection,
  MspCommand,
  ConnectionOptions,
  OpenConnectionFunction,
  OnCloseCallback,
} from "./types";

// Import bindings when we actually need them, so that libraries
// can import this library without the bindings needing to be available
// at import time
const initialiseBindings = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, global-require
  const Binding = require("@serialport/bindings");
  SerialPort.Binding = Binding;
};

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

  const sendData = data ? Buffer.from(Array.from(data)) : undefined;

  const { parser, serial, requests } = connection;

  const request =
    code > 254
      ? encodeMessageV2(code, sendData)
      : encodeMessageV1(code, sendData);

  const requestKey = request.toString("utf-8");
  let mspRequest = requests[requestKey];

  // Prevent FC lockup by checking if this request is currently being performed
  // and if not, making the request
  if (mspRequest === undefined) {
    let rejector: (err: Error) => void | undefined;
    const response = new Promise<ArrayBuffer>((resolve, reject) => {
      rejector = reject;
      // Throw an error if timeout is reached
      const timeoutId = setTimeout(() => {
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
          log(
            `${request.toJSON().data} response: ${
              Buffer.from(message.data).toJSON().data
            }, byteLength: ${message.data.byteLength}`
          );

          clearTimeout(timeoutId);
          resolve(message.data);
          parser.off("data", onData);
        }
      }

      parser.on("data", onData);
    });

    response.finally(() => {
      delete requests[requestKey];
    });

    mspRequest = {
      response,
      close: () => rejector?.(new Error("Connection closed")),
    };
    requests[requestKey] = mspRequest;

    log(`Writing ${request.toJSON().data} to ${port}`);
    serial.write(request);
    connection.bytesWritten += Buffer.byteLength(request);
  }

  // make every DataView unique to each request, even though
  // they are accessing the same set of data
  return (mspRequest.response as Promise<ArrayBuffer>).then(
    (responseData) => new MspDataView(responseData)
  );
};

/**
 * Execute the given CLI command and return the result. This will restart
 * the flight controller and may result in the connection being closed
 */
export const executeCli = async (
  port: string,
  command: string
): Promise<string> => {
  const connection = connectionsMap[port];
  if (!connection) {
    throw new Error(`${port} is not open`);
  }

  connection.mode = "cli";

  const { serial } = connection;
  // only 1 cli mode request can be completed at a time
  const release = await connection.cliLock.acquire();

  try {
    const inCliMode = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Could not enter cli mode"));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        serial.off("off", onData);
      }, 1000);

      function onData(data: Buffer): void {
        if (data.toString().includes("#")) {
          resolve();
          clearTimeout(timeout);
          serial.off("off", onData);
        }
      }

      serial.on("data", onData);
    });
    serial.write(Buffer.from(`#`, "utf-8"));
    await inCliMode;

    const responseReader = new Promise<string>((resolve, reject) => {
      let buffer = "";

      const timeout = setTimeout(() => {
        reject(new Error("Timed out waiting for cli response"));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        serial.off("off", onData);
      }, 10000);

      function onData(data: string): void {
        buffer += data.toString();
        if (data.includes("#")) {
          // only include the data before the exit command
          resolve(buffer.split("#")[0]);
          clearTimeout(timeout);
          serial.off("off", onData);
        }
      }

      serial.on("data", onData);
    });

    serial.write(Buffer.from(`${command}\n`, "utf-8"));

    const repsonse = await responseReader;

    const exit = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Problem exiting cli mode"));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        serial.off("off", onData);
      }, 1000);

      function onData(data: Buffer): void {
        if (data.toString().includes("#")) {
          resolve();
          clearTimeout(timeout);
          serial.off("off", onData);
        }
      }

      serial.on("data", onData);
    });
    serial.write(Buffer.from(`exit\r`, "utf-8"));

    await exit.catch(() => {});
    return repsonse;
  } finally {
    release();
  }
};

export const ports = async (): Promise<string[]> => {
  if (!SerialPort.Binding) {
    initialiseBindings();
  }
  return SerialPort.list().then((data) => data.map(({ path }) => path));
};

/**
 * Close the given port
 */
export const close = async (port: string): Promise<void> => {
  const connection = connectionsMap[port];
  if (!connection) {
    return;
  }
  const { serial } = connection;
  delete connectionsMap[port];

  const closePromise = serial.isOpen
    ? new Promise((resolve) => serial.on("close", resolve))
    : Promise.resolve();
  await new Promise((resolve) => serial.close(resolve));

  Object.values(connection.requests).forEach((request) => {
    request?.close();
  });

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
  log(`opening ${port}`);

  // Handle overloads
  let onCloseCallback = onClose;
  let connectionOptions = options;

  if (typeof connectionOptions === "function") {
    onCloseCallback = connectionOptions;
    connectionOptions = {};
  }

  if (!SerialPort.Binding) {
    initialiseBindings();
  }

  const serial = new SerialPort(port, {
    baudRate: 115200,
    ...connectionOptions,
    autoOpen: false,
  });

  await new Promise((resolve, reject) => {
    serial.open((err) => {
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

  const connection: Connection = {
    serial,
    parser,
    requests: {},
    bytesRead: 0,
    bytesWritten: 0,
    packetErrors: 0,
    mspInfo: {
      apiVersion: "0",
      mspProtocolVersion: 0,
    },
    cliLock: new Mutex(),
    mode: null,
  };

  connectionsMap[port] = connection;

  log(`reading API version from ${port}`);
  try {
    const response = await execute(port, { code: 1 });
    connection.mspInfo = {
      mspProtocolVersion: response.readU8(),
      apiVersion: `${response.readU8()}.${response.readU8()}.0`,
    };

    log(`read apiVersion=${connection.mspInfo.apiVersion}`);
  } catch (e) {
    log(`failed to read MSP info from ${port}, failed to open`);
    await close(port);
    throw new Error(`Could not read MSP version from ${port}`);
  }

  // Disconnect isn't notified unless we write to the serial
  // port after it disconnects. This interval constantly checks
  // the available ports, and issues a disconnect if the port
  // is removed
  const disconnectMonitor = setInterval(async () => {
    const list = await ports();
    if (!list.includes(port) && serial.isOpen) {
      close(port);
    }
  }, 250);

  // valid connection, setup listeners
  serial.on("data", (data: Buffer) => {
    connection.bytesRead += Buffer.byteLength(data);
  });

  serial.on("error", () => {
    log(`${port} on error received`);
    // Don't trigger close if this serial port is already
    // closed, as it means that the closing
    // will be dealt with by the close event
    if (serial.isOpen) {
      close(port);
    }
  });

  serial.on("close", async () => {
    log(`${port} on close received`);
    clearInterval(disconnectMonitor);
    await close(port);
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

/**
 * Private, used for testing
 */
export const raw = (port: string): SerialPort | undefined =>
  connectionsMap[port]?.serial;

/**
 * Private, used for testing
 */
export const reset = async (): Promise<void> => {
  await Promise.all(Object.keys(connectionsMap).map((port) => close(port)));
};
