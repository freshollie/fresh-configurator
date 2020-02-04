import SerialPort from "serialport"
import { MspParser, MspMessage, encode_message_v2, MspDataView } from "./msp";

const connections: Record<string, { serial: SerialPort, parser: MspParser }> = {};

export const ports = () => SerialPort.list();

export const connect = async (port: string, onClose?: () => void): Promise<boolean> => {
    if (connections[port]) {
        return true
    }

    let serial: SerialPort | undefined;
    await new Promise((resolve, reject) => {
        serial = new SerialPort(port, (err) => {
            serial = undefined;
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    });

    if (serial) {
        const parser = serial.pipe(new MspParser());

        connections[port] = {
            serial,
            parser
        };
        
        serial.on("close", () => {
            delete connections[port];
            onClose?.();
        });
    }

};

export const devices = (): string[] => Object.keys(connections);

interface ExecutionDetails {
    code: number;
    data?: number[];
    timeout?: number;
}

export const execute = async (port: string, { code, data, timeout = 5000 }: ExecutionDetails): Promise<MspDataView> => {
    if (!connections[port]) {
        throw new Error("Connection not open");
    }
    const { parser, serial } = connections[port];

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timed out during execution")), timeout);

        const onData = (message: MspMessage) => {
            if (message.code === code) {
                resolve(message.dataView)
                clearTimeout(timer);
                parser.off("data", onData);
            }
        }

        parser.on("data", onData);
        serial.write(Buffer.from(encode_message_v2(code, data)));
    })
}

export const close = async (port: string): Promise<void> => {
    connections[port]?.serial.close();
}
