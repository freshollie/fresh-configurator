/* eslint-disable max-classes-per-file */

declare module "@serialport/stream" {
  // In this case we are just dealing with types, which are still available
  // with the @types/serialport package
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  import SerialPort from "serialport";

  export default SerialPort;
}

declare module "@serialport/bindings" {
  export class AbstractBinding {
    static list(): Promise<PortInfo[]>;

    constructor(opt: OpenOptions);

    /**
     * Opens a connection to the serial port referenced by the path. Promise resolves after the port
     * is opened, configured and ready for use.
     * @param {string} path the path or com port to open
     * @param {openOptions} options openOptions for the serialport
     * @returns {Promise} Resolves after the port is opened and configured.
     */
    open(path: string, options: OpenOptions): Promise<void>;

    /**
     * Closes an open port
     */
    close(): Promise<void>;

    /**
     * Request a number of bytes from the SerialPort. This function is similar to Node's
     * [`fs.read`](http://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)
     * except it will always return at least one byte.
  
      * The in progress reads must error when the port is closed with an error object that has the
      * property `canceled` equal to `true`. Any other error will cause a disconnection.
  
      * @param {buffer} buffer Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
      * @param {integer} offset The offset in the buffer to start writing at.
      * @param {integer} length Specifies the maximum number of bytes to read.
      * @returns {Promise} Resolves with the number of bytes read after a read operation.
      */
    read(
      buffer: Buffer,
      offset: number,
      length: number
    ): Promise<{ bytesRead: number; buffer: Buffer }>;

    /**
    * Write bytes to the SerialPort. Only called when there is no pending write operation.

    * The in-progress writes must error when the port is closed, with an error object that has the
    * property `canceled` equal to `true`. Any other error will cause a disconnection.

    * @param {buffer} buffer - Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
    * @returns {Promise} Resolves after the data is passed to the operating system for writing.
    */
    write(buffer: Buffer): Promise<void>;

    /**
     * Changes connection settings on an open port. Only `baudRate` is supported.
     * @returns {Promise} Resolves once the port's baud rate changes.
     */
    update(options: { baudRate: number }): Promise<void>;

    /**
     * Set control flags on an open port.
     * @param {object=} options All options are operating system default when the port is opened.
     * Every flag is set on each call to the provided or default values. All options are always provided.
     * @param {Boolean} [options.brk=false] flag for brk
     * @param {Boolean} [options.cts=false] flag for cts
     * @param {Boolean} [options.dsr=false] flag for dsr
     * @param {Boolean} [options.dtr=true] flag for dtr
     * @param {Boolean} [options.rts=true] flag for rts
     * @returns {Promise} Resolves once the port's flags are set.
     */
    set(options): Promise<void>;

    /**
     * Get the control flags (CTS, DSR, DCD) on the open port.
     * @returns {Promise} Resolves with the retrieved flags.
     */
    get(): Promise<Flags>;

    /**
     * Get the OS reported baud rate for the open port. Used mostly for debugging custom baud rates.
     */
    getBaudRate(): Promise<number>;

    /**
     * Flush (discard) data received but not read, and written but not transmitted.
     * @returns {Promise} Resolves once the flush operation finishes.
     */
    flush(): Promise<void>;

    /**
     * Drain waits until all output data is transmitted to the serial port. An in-progress write
     * should be completed before this returns.
     * @returns {Promise} Resolves once the drain operation finishes.
     */
    drain(): Promise<void>;
  }

  declare const Binding: AbstractBinding;
  export default Binding;
}

declare module "@serialport/binding-mock" {
  import { AbstractBinding } from "@serialport/bindings";

  class MockBinding extends AbstractBinding {
    // if record is true this buffer will have all data that has been written to this port
    readonly recording: Buffer;

    // the buffer of the latest written data
    readonly lastWrite: null | Buffer;

    // Create a mock port
    static createPort(
      path: string,
      opt: { echo?: boolean; record?: boolean; readyData?: Buffer }
    ): void;

    // Reset available mock ports
    static reset(): void;

    // list mock ports
    static list(): Promise<PortInfo[]>;

    // Emit data on a mock port
    emitData(data: Buffer | string | number[]);

    // Standard bindings interface
    open(path: string, opt: OpenOpts): Promise<void>;

    close(): Promise<void>;

    read(buffer: Buffer, offset: number, length: number): Promise<Buffer>;

    write(buffer: Buffer): Promise<void>;

    update(options: { baudRate: number }): Promise<void>;

    set(options): Promise<void>;

    get(): Promise<Flags>;

    getBaudRate(): Promise<number>;

    flush(): Promise<void>;

    drain(): Promise<void>;
  }

  export default MockBinding;
}
