/**
 * MSP Serial connections. This allows us to make multiple
 * serial connections, and enables execution of commands
 * on the given connection.
 *
 * The module handles making requests, and dealing with only
 * making one of the same request at a time.
 */

import { MspDataView } from "./utils";
import { MspMessage, MspParser } from "./parser";
import { encodeMessageV2 } from "./encoders";

import SerialPort = require("serialport");

interface Connection {
  serial: SerialPort;
  parser: MspParser;
  requests: Record<string, Promise<ArrayBuffer>>;
}
const connectionsMap: Record<string, Connection> = {};

export const ports = (): Promise<string[]> =>
  SerialPort.list().then(data => data.map(({ path }) => path));

/**
 * Close the given port
 */
export const close = (port: string): void => {
  connectionsMap[port]?.serial.close();
  delete connectionsMap[port];
};

/**
 * Open a serial connection on the given
 * port, onClose will be emited once the
 * connection is closed
 */
export const open = async (
  port: string,
  onClose?: () => void
): Promise<boolean> => {
  if (connectionsMap[port]) {
    return true;
  }

  let serial: SerialPort | undefined;
  await new Promise((resolve, reject) => {
    serial = new SerialPort(port, err => {
      console.log("callback error");
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  if (serial) {
    const parser = serial.pipe(new MspParser());
    parser.setMaxListeners(1000000);

    connectionsMap[port] = {
      serial,
      parser,
      requests: {}
    };

    serial.on("error", () => {
      close(port);
    });

    serial.on("close", () => {
      onClose?.();
    });
  }

  return true;
};

export const connections = (): string[] => Object.keys(connectionsMap);
export const isConnected = (port: string): boolean => !!connectionsMap[port];

interface MspCommand {
  code: number;
  data?: number[];
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

  const request = Buffer.from(encodeMessageV2(code, data));
  const requestKey = request.toString();
  const existingRequest = requests[requestKey];

  // Prevent FC lockup by checking if this request is currently being performed
  // and if not, making the request
  if (!existingRequest) {
    serial.write(request);

    requests[requestKey] = new Promise((resolve, reject) => {
      const onData = (message: MspMessage): void => {
        if (message.code === code) {
          // Copy the data view
          resolve(message.dataView.buffer());
          parser.off("data", onData);
        }
      };

      // Throw an error if timeout is reached
      setTimeout(() => {
        parser.off("data", onData);
        reject(new Error("timed out during execution"));
      }, timeout);

      parser.on("data", onData);
    });

    requests[requestKey].finally(() => {
      delete requests[requestKey];
    });
  }

  // make every DataView unique to each request, even though
  // they are accessing the same set of data
  return requests[requestKey].then(data => new MspDataView(data));
};
