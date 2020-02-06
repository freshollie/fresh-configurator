/**
 * The MSP Parser
 *
 * This module is designed to parse bytes and
 * emit data once the full request has been
 * received, parsed, and checked.
 */

/* eslint-disable no-bitwise */
import { Transform } from "stream";
import { MspDataView, crc8DvbS2 } from "./utils";

const SYMBOLS = {
  BEGIN: "$".charCodeAt(0),
  PROTO_V1: "M".charCodeAt(0),
  PROTO_V2: "X".charCodeAt(0),
  FROM_MWC: ">".charCodeAt(0),
  TO_MWC: "<".charCodeAt(0),
  UNSUPPORTED: "!".charCodeAt(0)
};

const enum CONSTANTS {
  PROTOCOL_V1 = 1,
  PROTOCOL_V2 = 2,
  JUMBO_FRAME_MIN_SIZE = 255
}

const enum DECODER_STATES {
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
  CHECKSUM_V2 = 17
}

export interface MspMessage {
  code: number;
  dataView: MspDataView;
  crcError: boolean;
  unsupported: number;
  direction: number;
}

export class MspParser extends Transform {
  private state: DECODER_STATES;
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
    cb: (error?: Error | null, data?: any) => void
  ): void {
    const data = new Uint8Array(chunk);

    for (let i = 0; i < data.length; i += 1) {
      switch (this.state) {
        case DECODER_STATES.IDLE: // sync char 1
          if (data[i] === SYMBOLS.BEGIN) {
            this.state = DECODER_STATES.PROTO_IDENTIFIER;
          }
          break;
        case DECODER_STATES.PROTO_IDENTIFIER: // sync char 2
          switch (data[i]) {
            case SYMBOLS.PROTO_V1:
              this.state = DECODER_STATES.DIRECTION_V1;
              break;
            case SYMBOLS.PROTO_V2:
              this.state = DECODER_STATES.DIRECTION_V2;
              break;
            default:
              console.log(
                `Unknown protocol char ${String.fromCharCode(data[i])}`
              );
              this.state = DECODER_STATES.IDLE;
          }
          break;
        case DECODER_STATES.DIRECTION_V1: // direction (should be >)
        case DECODER_STATES.DIRECTION_V2:
          this.unsupported = 0;
          switch (data[i]) {
            case SYMBOLS.FROM_MWC:
              this.messageDirection = 1;
              break;
            case SYMBOLS.TO_MWC:
              this.messageDirection = 0;
              break;
            case SYMBOLS.UNSUPPORTED:
              this.unsupported = 1;
              break;
            default:
          }
          this.state =
            this.state === DECODER_STATES.DIRECTION_V1
              ? DECODER_STATES.PAYLOAD_LENGTH_V1
              : DECODER_STATES.FLAG_V2;
          break;
        case DECODER_STATES.FLAG_V2:
          // Ignored for now
          this.state = DECODER_STATES.CODE_V2_LOW;
          break;
        case DECODER_STATES.PAYLOAD_LENGTH_V1:
          this.message_length_expected = data[i];

          if (this.message_length_expected === CONSTANTS.JUMBO_FRAME_MIN_SIZE) {
            this.state = DECODER_STATES.CODE_JUMBO_V1;
          } else {
            this.initializeReadBuffer();
            this.state = DECODER_STATES.CODE_V1;
          }

          break;
        case DECODER_STATES.PAYLOAD_LENGTH_V2_LOW:
          this.message_length_expected = data[i];
          this.state = DECODER_STATES.PAYLOAD_LENGTH_V2_HIGH;
          break;
        case DECODER_STATES.PAYLOAD_LENGTH_V2_HIGH:
          this.message_length_expected |= data[i] << 8;
          this.initializeReadBuffer();
          this.state =
            this.message_length_expected > 0
              ? DECODER_STATES.PAYLOAD_V2
              : DECODER_STATES.CHECKSUM_V2;
          break;
        case DECODER_STATES.CODE_V1:
        case DECODER_STATES.CODE_JUMBO_V1:
          this.code = data[i];
          if (this.message_length_expected > 0) {
            // process payload
            if (this.state === DECODER_STATES.CODE_JUMBO_V1) {
              this.state = DECODER_STATES.PAYLOAD_LENGTH_JUMBO_LOW;
            } else {
              this.state = DECODER_STATES.PAYLOAD_V1;
            }
          } else {
            // no payload
            this.state = DECODER_STATES.CHECKSUM_V1;
          }
          break;
        case DECODER_STATES.CODE_V2_LOW:
          this.code = data[i];
          this.state = DECODER_STATES.CODE_V2_HIGH;
          break;
        case DECODER_STATES.CODE_V2_HIGH:
          this.code |= data[i] << 8;
          this.state = DECODER_STATES.PAYLOAD_LENGTH_V2_LOW;
          break;
        case DECODER_STATES.PAYLOAD_LENGTH_JUMBO_LOW:
          this.message_length_expected = data[i];
          this.state = DECODER_STATES.PAYLOAD_LENGTH_JUMBO_HIGH;
          break;
        case DECODER_STATES.PAYLOAD_LENGTH_JUMBO_HIGH:
          this.message_length_expected |= data[i] << 8;
          this.initializeReadBuffer();
          this.state = DECODER_STATES.PAYLOAD_V1;
          break;
        case DECODER_STATES.PAYLOAD_V1:
        case DECODER_STATES.PAYLOAD_V2:
          this.message_buffer_uint8_view[this.message_length_received] =
            data[i];
          this.message_length_received += 1;

          if (this.message_length_received >= this.message_length_expected) {
            this.state =
              this.state === DECODER_STATES.PAYLOAD_V1
                ? DECODER_STATES.CHECKSUM_V1
                : DECODER_STATES.CHECKSUM_V2;
          }
          break;
        case DECODER_STATES.CHECKSUM_V1:
          if (this.message_length_expected >= CONSTANTS.JUMBO_FRAME_MIN_SIZE) {
            this.message_checksum = CONSTANTS.JUMBO_FRAME_MIN_SIZE;
          } else {
            this.message_checksum = this.message_length_expected;
          }
          this.message_checksum ^= this.code;
          if (this.message_length_expected >= CONSTANTS.JUMBO_FRAME_MIN_SIZE) {
            this.message_checksum ^= this.message_length_expected & 0xff;
            this.message_checksum ^=
              (this.message_length_expected & 0xff00) >> 8;
          }
          for (let ii = 0; ii < this.message_length_received; ii += 1) {
            this.message_checksum ^= this.message_buffer_uint8_view[ii];
          }
          this.dispatchMessage(data[i]);
          break;
        case DECODER_STATES.CHECKSUM_V2:
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
          for (let ii = 0; ii < this.message_length_received; ii += 1) {
            this.message_checksum = crc8DvbS2(
              this.message_checksum,
              this.message_buffer_uint8_view[ii]
            );
          }
          this.dispatchMessage(data[i]);
          break;
        default:
          console.log(`Unknown state detected: ${this.state}`);
      }
    }
    cb();
  }

  private initializeReadBuffer(): void {
    this.message_buffer = new ArrayBuffer(this.message_length_expected);
    this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
  }

  private dispatchMessage(expectedChecksum: number): void {
    let dataView: MspDataView;
    if (this.message_checksum === expectedChecksum) {
      // message received, store dataview
      dataView = new MspDataView(
        this.message_buffer,
        0,
        this.message_length_expected
      );
    } else {
      console.log(`code: ${this.code} - crc failed`);
      this.crcError = true;
      dataView = new MspDataView(new ArrayBuffer(0));
    }
    const message: MspMessage = {
      code: this.code,
      dataView,
      crcError: this.crcError,
      unsupported: this.unsupported,
      direction: this.messageDirection
    };

    this.emit("data", message);
    this.reset();
  }

  private reset(): void {
    this.message_length_received = 0;
    this.state = DECODER_STATES.IDLE;
    this.crcError = false;
  }

  // eslint-disable-next-line no-underscore-dangle
  public _flush(cb: () => void): void {
    this.reset();
    cb();
  }
}
