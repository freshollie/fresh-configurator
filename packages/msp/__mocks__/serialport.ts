import SerialPort from "@serialport/stream";
import MockBinding from "@serialport/binding-mock";

// Types are wrong for SerialPort.Binding
// eslint-disable-next-line @typescript-eslint/no-explicit-any
SerialPort.Binding = MockBinding as any;

export default SerialPort;
