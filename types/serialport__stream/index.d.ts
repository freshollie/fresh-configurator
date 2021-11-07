// In this case we are just dealing with types, which are still available
// with the @types/serialport package
import SerialPort from "serialport";

class CorrectSerialPort extends Omit<SerialPort, "Binding"> {
  static Binding: typeof SerialPort.BaseBinding;
}

export = CorrectSerialPort;
