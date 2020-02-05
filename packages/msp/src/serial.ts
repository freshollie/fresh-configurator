/**
 * MSP Serial connections. This allows us to make multiple
 * serial connections, and enables execution of commands
 * on the given connection.
 */
import { MspDataView } from "./utils";
import { MspMessage, MspParser } from "./parser";
import { encodeMessageV2 } from "./encoders";

import SerialPort = require("serialport");

interface Connection {
  serial: SerialPort;
  parser: MspParser;
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
      parser
    };

    serial.on("error", () => {
      console.log("emmited error");
      close(port);
    });

    serial.on("close", () => {
      console.log("emmited close");
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

  const { parser, serial } = connectionsMap[port];

  serial.write(Buffer.from(encodeMessageV2(code, data)));

  return new Promise((resolve, reject) => {
    const onData = (message: MspMessage): void => {
      if (message.code === code) {
        // Copy the data view
        resolve(new MspDataView(message.dataView.buffer()));
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
};
