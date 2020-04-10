import SerialPort from "@serialport/stream";
import MockBinding from "@serialport/binding-mock";

// Types are wrong for SerialPort.Binding
SerialPort.Binding = MockBinding as any;

export default SerialPort;
