import MockBindings from "@serialport/binding-mock";

// Trick our tests into using mock bindings for the
// serial port bindings, rather than the real bindings
export = MockBindings;
