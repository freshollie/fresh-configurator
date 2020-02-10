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
import { MspDataView } from "./utils";
import { MspMessage, MspParser } from "./parser";
import { encodeMessageV2, encodeMessageV1 } from "./encoders";

const log = debug("connection");

interface Connection {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<string, Promise<ArrayBuffer> | undefined>;
}
const connectionsMap: Record<string, Connection> = {};

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
  if (!connectionsMap[port]) {
    return;
  }
  const { serial } = connectionsMap[port];

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
export const open = async (
  port: string,
  onClose?: () => void
): Promise<void> => {
  if (connectionsMap[port]) {
    throw new Error(`${port} is already open`);
  }

  const serial = new SerialPort(port, { autoOpen: false });

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

  connectionsMap[port] = {
    serial,
    parser,
    requests: {}
  };

  serial.on("error", () => {
    log(`${port} on error received`);
    close(port);
  });

  serial.on("close", () => {
    log(`${port} on close received`);
    close(port);
    onClose?.();
  });
};

export const connections = (): string[] => Object.keys(connectionsMap);
export const isOpen = (port: string): boolean => !!connectionsMap[port];

interface MspCommand {
  code: number;
  data?: Buffer;
  timeout?: number;
}

/**
 * Execute the given MspCommand on the given port.
 *
 * Return the data received from the command
 */
export const execute = async (
  port: string,
  { code, data, timeout = 5000 }: MspCommand
): Promise<MspDataView> => {
  if (!connectionsMap[port]) {
    throw new Error(`${port} is not open`);
  }
  const { parser, serial, requests } = connectionsMap[port];

  const request =
    code > 254 ? encodeMessageV2(code, data) : encodeMessageV1(code, data);
  const requestKey = request.toString("utf-8");
  const existingRequest = requests[requestKey];

  // Prevent FC lockup by checking if this request is currently being performed
  // and if not, making the request
  if (!existingRequest) {
    requests[requestKey] = new Promise((resolve, reject) => {
      // Throw an error if timeout is reached
      const timeoutId = setTimeout(() => {
        delete requests[requestKey];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        parser.off("data", onData);
        reject(new Error("Timed out during execution"));
      }, timeout);

      function onData(message: MspMessage): void {
        if (message.code === code && !message.crcError) {
          log(`${request.toJSON().data} response: ${message.data}`);

          delete requests[requestKey];
          clearTimeout(timeoutId);

          resolve(message.data);
          parser.off("data", onData);
        }
      }

      parser.on("data", onData);
    });

    log(`Writing ${request.toJSON().data} to ${port}`);
    serial.write(request);
  }

  // make every DataView unique to each request, even though
  // they are accessing the same set of data
  return requests[requestKey]!.then(
    responseData => new MspDataView(responseData)
  );
};
