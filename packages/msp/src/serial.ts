/**
 * MSP Serial connections. This allows us to make multiple
 * serial connections, and enables execution of commands
 * on the given connection.
 */
import { MspDataView } from "./utils";
import { MspMessage, MspParser } from "./parser";
import SerialPort = require("serialport");
import { encode_message_v2 } from "./encoders";

interface Connection {
  serial: SerialPort;
  parser: MspParser;
}
const connectionsMap: Record<string, Connection> = {};

export const ports = () =>
  SerialPort.list().then(data => data.map(({ path }) => path));

export const connect = async (
  port: string,
  onClose?: () => void
): Promise<boolean> => {
  if (connectionsMap[port]) {
    return true;
  }

  let serial: SerialPort | undefined;
  await new Promise((resolve, reject) => {
    serial = new SerialPort(port, err => {
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

    serial.on("close", () => {
      delete connectionsMap[port];
      onClose?.();
    });
  }

  return true;
};

export const connections = (): string[] => Object.keys(connectionsMap);
export const isConnected = (port: string) => !!connectionsMap[port];

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

  serial.write(Buffer.from(encode_message_v2(code, data)));

  return new Promise((resolve, reject) => {
    const onData = (message: MspMessage) => {
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

/**
 * Close the given port
 */
export const close = async (port: string): Promise<void> => {
  connectionsMap[port]?.serial.close();
};
