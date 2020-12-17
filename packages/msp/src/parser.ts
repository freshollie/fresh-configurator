/**
 * The MSP Parser
 *
 * This module is designed to parse bytes and
 * emit data once the full request has been
 * received, parsed, and checked.
 *
 * The sourcecode in this module can mostly be attributed
 * to the betaflight-configurator repository, but has
 * been ported to typescript and redesigned to work
 * with node-serialport
 */

import { Transform } from "stream";
import debug from "debug";
import { crc8DvbS2 } from "./utils";

const log = debug("msp:parser");

const Symbols = {
  BEGIN: "$".charCodeAt(0),
  PROTO_V1: "M".charCodeAt(0),
  PROTO_V2: "X".charCodeAt(0),
  FROM_MWC: ">".charCodeAt(0),
  TO_MWC: "<".charCodeAt(0),
  UNSUPPORTED: "!".charCodeAt(0),
};

enum Constants {
  PROTOCOL_V1 = 1,
  PROTOCOL_V2 = 2,
  JUMBO_FRAME_MIN_SIZE = 255,
}

enum DecoderStates {
  IDLE = 0,
  PROTO_IDENTIFIER = 1,
  DIRECTION_V1 = 2,
  DIRECTION_V2 = 3,
  FLAG_V2 = 4,
  PAYLOAD_LENGTH_V1 = 5,
  PAYLOAD_LENGTH_JUMBO_LOW = 6,
  PAYLOAD_LENGTH_JUMBO_HIGH = 7,
  PAYLOAD_LENGTH_V2_LOW = 8,
  PAYLOAD_LENGTH_V2_HIGH = 9,
  CODE_V1 = 10,
  CODE_JUMBO_V1 = 11,
  CODE_V2_LOW = 12,
  CODE_V2_HIGH = 13,
  PAYLOAD_V1 = 14,
  PAYLOAD_V2 = 15,
  CHECKSUM_V1 = 16,
  CHECKSUM_V2 = 17,
}

export type MspMessage = {
  code: number;
  data: ArrayBuffer;
  crcError: boolean;
  unsupported: number;
  direction: number;
};

export class MspParser extends Transform {
  private state: DecoderStates;

  private messageDirection: number;

  private code: number;

  private message_length_expected: number;

  private message_length_received: number;

  private message_buffer: ArrayBuffer;

  private message_buffer_uint8_view: Uint8Array;

  private message_checksum: number;

  private crcError: boolean;

  private unsupported: number;

  constructor() {
    super();

    this.state = 0;
    this.messageDirection = 1;
    this.code = 0;
    this.message_length_expected = 0;
    this.message_length_received = 0;
    this.message_buffer = new ArrayBuffer(0);
    this.message_buffer_uint8_view = new Uint8Array(0);
    this.message_checksum = 0;
    this.crcError = false;
    this.unsupported = 0;
  }

  // eslint-disable-next-line no-underscore-dangle
  public _transform(
    chunk: Buffer,
    _: string,
    cb: (error?: Error | null, data?: Buffer) => void
  ): void {
    log(`Received data ${chunk.toJSON().data}`);
    const data = new Uint8Array(chunk);

    data.forEach((byte) => {
      switch (this.state) {
        case DecoderStates.IDLE: // sync char 1
          if (byte === Symbols.BEGIN) {
            this.state = DecoderStates.PROTO_IDENTIFIER;
          }
          break;
        case DecoderStates.PROTO_IDENTIFIER: // sync char 2
          switch (byte) {
            case Symbols.PROTO_V1:
              this.state = DecoderStates.DIRECTION_V1;
              break;
            case Symbols.PROTO_V2:
              this.state = DecoderStates.DIRECTION_V2;
              break;
            default:
              log(`Unknown protocol char ${String.fromCharCode(byte)}`);
              this.state = DecoderStates.IDLE;
          }
          break;
        case DecoderStates.DIRECTION_V1: // direction (should be >)
        case DecoderStates.DIRECTION_V2:
          this.unsupported = 0;
          switch (byte) {
            case Symbols.FROM_MWC:
              this.messageDirection = 1;
              break;
            case Symbols.TO_MWC:
              this.messageDirection = 0;
              break;
            case Symbols.UNSUPPORTED:
              this.unsupported = 1;
              break;
            default:
          }
          this.state =
            this.state === DecoderStates.DIRECTION_V1
              ? DecoderStates.PAYLOAD_LENGTH_V1
              : DecoderStates.FLAG_V2;
          break;
        case DecoderStates.FLAG_V2:
          // Ignored for now
          this.state = DecoderStates.CODE_V2_LOW;
          break;
        case DecoderStates.PAYLOAD_LENGTH_V1:
          this.message_length_expected = byte;

          if (this.message_length_expected === Constants.JUMBO_FRAME_MIN_SIZE) {
            this.state = DecoderStates.CODE_JUMBO_V1;
          } else {
            this.initializeReadBuffer();
            this.state = DecoderStates.CODE_V1;
          }

          break;
        case DecoderStates.PAYLOAD_LENGTH_V2_LOW:
          this.message_length_expected = byte;
          this.state = DecoderStates.PAYLOAD_LENGTH_V2_HIGH;
          break;
        case DecoderStates.PAYLOAD_LENGTH_V2_HIGH:
          this.message_length_expected |= byte << 8;
          this.initializeReadBuffer();
          this.state =
            this.message_length_expected > 0
              ? DecoderStates.PAYLOAD_V2
              : DecoderStates.CHECKSUM_V2;
          break;
        case DecoderStates.CODE_V1:
        case DecoderStates.CODE_JUMBO_V1:
          this.code = byte;
          if (this.message_length_expected > 0) {
            // process payload
            if (this.state === DecoderStates.CODE_JUMBO_V1) {
              this.state = DecoderStates.PAYLOAD_LENGTH_JUMBO_LOW;
            } else {
              this.state = DecoderStates.PAYLOAD_V1;
            }
          } else {
            // no payload
            this.state = DecoderStates.CHECKSUM_V1;
          }
          break;
        case DecoderStates.CODE_V2_LOW:
          this.code = byte;
          this.state = DecoderStates.CODE_V2_HIGH;
          break;
        case DecoderStates.CODE_V2_HIGH:
          this.code |= byte << 8;
          this.state = DecoderStates.PAYLOAD_LENGTH_V2_LOW;
          break;
        case DecoderStates.PAYLOAD_LENGTH_JUMBO_LOW:
          this.message_length_expected = byte;
          this.state = DecoderStates.PAYLOAD_LENGTH_JUMBO_HIGH;
          break;
        case DecoderStates.PAYLOAD_LENGTH_JUMBO_HIGH:
          this.message_length_expected |= byte << 8;
          this.initializeReadBuffer();
          this.state = DecoderStates.PAYLOAD_V1;
          break;
        case DecoderStates.PAYLOAD_V1:
        case DecoderStates.PAYLOAD_V2:
          this.message_buffer_uint8_view[this.message_length_received] = byte;
          this.message_length_received += 1;

          if (this.message_length_received >= this.message_length_expected) {
            this.state =
              this.state === DecoderStates.PAYLOAD_V1
                ? DecoderStates.CHECKSUM_V1
                : DecoderStates.CHECKSUM_V2;
          }
          break;
        case DecoderStates.CHECKSUM_V1:
          if (this.message_length_expected >= Constants.JUMBO_FRAME_MIN_SIZE) {
            this.message_checksum = Constants.JUMBO_FRAME_MIN_SIZE;
          } else {
            this.message_checksum = this.message_length_expected;
          }
          this.message_checksum ^= this.code;
          if (this.message_length_expected >= Constants.JUMBO_FRAME_MIN_SIZE) {
            this.message_checksum ^= this.message_length_expected & 0xff;
            this.message_checksum ^=
              (this.message_length_expected & 0xff00) >> 8;
          }

          this.message_buffer_uint8_view
            .slice(0, this.message_length_received)
            .forEach((messageByte) => {
              this.message_checksum ^= messageByte;
            });

          this.dispatchMessage(byte);
          break;
        case DecoderStates.CHECKSUM_V2:
          this.message_checksum = 0;
          this.message_checksum = crc8DvbS2(this.message_checksum, 0); // flag
          this.message_checksum = crc8DvbS2(
            this.message_checksum,
            this.code & 0xff
          );
          this.message_checksum = crc8DvbS2(
            this.message_checksum,
            (this.code & 0xff00) >> 8
          );
          this.message_checksum = crc8DvbS2(
            this.message_checksum,
            this.message_length_expected & 0xff
          );
          this.message_checksum = crc8DvbS2(
            this.message_checksum,
            (this.message_length_expected & 0xff00) >> 8
          );

          this.message_buffer_uint8_view
            .slice(0, this.message_length_received)
            .forEach((messageByte) => {
              this.message_checksum = crc8DvbS2(
                this.message_checksum,
                messageByte
              );
            });
          this.dispatchMessage(byte);
          break;
        default:
          log(`Unknown state detected: ${this.state}`);
      }
    });
    cb();
  }

  private initializeReadBuffer(): void {
    this.message_buffer = new ArrayBuffer(this.message_length_expected);
    this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
  }

  private dispatchMessage(expectedChecksum: number): void {
    let data: ArrayBuffer;
    if (this.message_checksum === expectedChecksum) {
      // message received, store dataview
      data = new DataView(this.message_buffer, 0, this.message_length_expected)
        .buffer;
    } else {
      log(
        `code: ${this.code} - crc failed, expectedChecksum=${expectedChecksum}, checksum=${this.message_checksum}`
      );
      this.crcError = true;
      data = new ArrayBuffer(0);
    }
    log(`Parsed message: ${Buffer.from(data).toJSON().data}`);

    this.emit("data", {
      code: this.code,
      data,
      crcError: this.crcError,
      unsupported: this.unsupported,
      direction: this.messageDirection,
    });
    this.reset();
  }

  private reset(): void {
    this.message_length_received = 0;
    this.state = DecoderStates.IDLE;
    this.crcError = false;
  }

  // eslint-disable-next-line no-underscore-dangle
  public _flush(cb: () => void): void {
    this.reset();
    cb();
  }
}
