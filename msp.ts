import { Transform } from 'stream'

const SYMBOLS = {
    BEGIN: '$'.charCodeAt(0),
    PROTO_V1: 'M'.charCodeAt(0),
    PROTO_V2: 'X'.charCodeAt(0),
    FROM_MWC: '>'.charCodeAt(0),
    TO_MWC: '<'.charCodeAt(0),
    UNSUPPORTED: '!'.charCodeAt(0),
};

const enum CONSTANTS {
    PROTOCOL_V1 = 1,
    PROTOCOL_V2 = 2,
    JUMBO_FRAME_MIN_SIZE = 255,
};

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
    CHECKSUM_V2 = 17,
};

const crc8_dvb_s2 = (crc: number, ch: number): number => {
    crc ^= ch;
    for (let ii = 0; ii < 8; ii++) {
        if (crc & 0x80) {
            crc = ((crc << 1) & 0xFF) ^ 0xD5;
        } else {
            crc = (crc << 1) & 0xFF;
        }
    }
    return crc;
}

const crc8_dvb_s2_data = (data, start, end) => {
    let crc = 0;
    for (let ii = start; ii < end; ii++) {
        crc = this.crc8_dvb_s2(crc, data[ii]);
    }
    return crc;
}

export const encode_message_v1 = (code, data) => {
    let bufferOut;
    // always reserve 6 bytes for protocol overhead !
    if (data) {
        var size = data.length + 6,
            checksum = 0;

        bufferOut = new ArrayBuffer(size);
        let bufView = new Uint8Array(bufferOut);

        bufView[0] = 36; // $
        bufView[1] = 77; // M
        bufView[2] = 60; // <
        bufView[3] = data.length;
        bufView[4] = code;

        checksum = bufView[3] ^ bufView[4];

        for (var i = 0; i < data.length; i++) {
            bufView[i + 5] = data[i];

            checksum ^= bufView[i + 5];
        }

        bufView[5 + data.length] = checksum;
    } else {
        bufferOut = new ArrayBuffer(6);
        let bufView = new Uint8Array(bufferOut);

        bufView[0] = 36; // $
        bufView[1] = 77; // M
        bufView[2] = 60; // <
        bufView[3] = 0; // data length
        bufView[4] = code; // code
        bufView[5] = bufView[3] ^ bufView[4]; // checksum
    }
    return bufferOut;
}


export const encode_message_v2 = (code, data) => {
    const dataLength = data ? data.length : 0;
    // 9 bytes for protocol overhead
    const bufferSize = dataLength + 9;
    const bufferOut = new ArrayBuffer(bufferSize);
    const bufView = new Uint8Array(bufferOut);
    bufView[0] = 36; // $
    bufView[1] = 88; // X
    bufView[2] = 60; // <
    bufView[3] = 0;  // flag
    bufView[4] = code & 0xFF;
    bufView[5] = (code >> 8) & 0xFF;
    bufView[6] = dataLength & 0xFF;
    bufView[7] = (dataLength >> 8) & 0xFF;
    for (let ii = 0; ii < dataLength; ii++) {
        bufView[8 + ii] = data[ii];
    }
    bufView[bufferSize - 1] = crc8_dvb_s2_data(bufView, 3, bufferSize - 1);
    return bufferOut;
}

export class MspDataView extends DataView {
    private offset = 0;
    public readU8() {
        if (this.byteLength >= this.offset + 1) {
            return this.getUint8(this.offset++);
        } else {
            return null;
        }
    };

    public readU16() {
        if (this.byteLength >= this.offset + 2) {
            return this.readU8() + this.readU8() * 256;
        } else {
            return null;
        }
    };

    public readU32() {
        if (this.byteLength >= this.offset + 4) {
            return this.readU16() + this.readU16() * 65536;
        } else {
            return null;
        }
    };

    public read8() {
        if (this.byteLength >= this.offset + 1) {
            return this.getInt8(this.offset++);
        } else {
            return null;
        }
    };

    public read16() {
        this.offset += 2;
        if (this.byteLength >= this.offset) {
            return this.getInt16(this.offset - 2, true);
        } else {
            return null;
        }
    };

    public read32() {
        this.offset += 4;
        if (this.byteLength >= this.offset) {
            return this.getInt32(this.offset - 4, true);
        } else {
            return null;
        }
    };

    public remaining() {
        return this.byteLength - this.offset;
    };
}

export interface MspMessage {
    code: number;
    dataView: MspDataView;
    crcError: boolean;
    unsupported: number;
}

export class MspParser extends Transform {
    private state: DECODER_STATES;
    private message_direction: number;
    private code: number;
    private message_length_expected: number;
    private message_length_received: number;
    private message_buffer: ArrayBuffer;
    private message_buffer_uint8_view: Uint8Array;
    private message_checksum: number;
    private messageIsJumboFrame: boolean;
    private crcError: boolean;
    private unsupported: number;
    private packet_errors: number;

    constructor() {
        super()

        this.state = 0;
        this.message_direction = 1;
        this.code = 0;
        this.message_length_expected = 0;
        this.message_length_received = 0;
        this.message_buffer = new ArrayBuffer(0);
        this.message_buffer_uint8_view = new Uint8Array(0);
        this.message_checksum = 0;
        this.messageIsJumboFrame = false;
        this.crcError = false;
        this.packet_errors = 0;
    }

    public _transform(chunk, encoding, cb) {
        var data = new Uint8Array(chunk);

        for (var i = 0; i < data.length; i++) {
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
                            console.log(`Unknown protocol char ${String.fromCharCode(data[i])}`);
                            this.state = DECODER_STATES.IDLE;
                    }
                    break;
                case DECODER_STATES.DIRECTION_V1: // direction (should be >)
                case DECODER_STATES.DIRECTION_V2:
                    this.unsupported = 0;
                    switch (data[i]) {
                        case SYMBOLS.FROM_MWC:
                            this.message_direction = 1;
                            break;
                        case SYMBOLS.TO_MWC:
                            this.message_direction = 0;
                            break;
                        case SYMBOLS.UNSUPPORTED:
                            this.unsupported = 1;
                            break;
                    }
                    this.state = this.state === DECODER_STATES.DIRECTION_V1 ?
                        DECODER_STATES.PAYLOAD_LENGTH_V1 :
                        DECODER_STATES.FLAG_V2;
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
                        this._initialize_read_buffer();
                        this.state = DECODER_STATES.CODE_V1;
                    }

                    break;
                case DECODER_STATES.PAYLOAD_LENGTH_V2_LOW:
                    this.message_length_expected = data[i];
                    this.state = DECODER_STATES.PAYLOAD_LENGTH_V2_HIGH;
                    break;
                case DECODER_STATES.PAYLOAD_LENGTH_V2_HIGH:
                    this.message_length_expected |= data[i] << 8;
                    this._initialize_read_buffer();
                    this.state = this.message_length_expected > 0 ?
                        DECODER_STATES.PAYLOAD_V2 :
                        DECODER_STATES.CHECKSUM_V2;
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
                    this._initialize_read_buffer();
                    this.state = DECODER_STATES.PAYLOAD_V1;
                    break;
                case DECODER_STATES.PAYLOAD_V1:
                case DECODER_STATES.PAYLOAD_V2:
                    this.message_buffer_uint8_view[this.message_length_received] = data[i];
                    this.message_length_received++;

                    if (this.message_length_received >= this.message_length_expected) {
                        this.state = this.state === DECODER_STATES.PAYLOAD_V1 ?
                            DECODER_STATES.CHECKSUM_V1 :
                            DECODER_STATES.CHECKSUM_V2;
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
                        this.message_checksum ^= this.message_length_expected & 0xFF;
                        this.message_checksum ^= (this.message_length_expected & 0xFF00) >> 8;
                    }
                    for (let ii = 0; ii < this.message_length_received; ii++) {
                        this.message_checksum ^= this.message_buffer_uint8_view[ii];
                    }
                    this._dispatch_message(data[i]);
                    break;
                case DECODER_STATES.CHECKSUM_V2:
                    this.message_checksum = 0;
                    this.message_checksum = crc8_dvb_s2(this.message_checksum, 0); // flag
                    this.message_checksum = crc8_dvb_s2(this.message_checksum, this.code & 0xFF);
                    this.message_checksum = crc8_dvb_s2(this.message_checksum, (this.code & 0xFF00) >> 8);
                    this.message_checksum = crc8_dvb_s2(this.message_checksum, this.message_length_expected & 0xFF);
                    this.message_checksum = crc8_dvb_s2(this.message_checksum, (this.message_length_expected & 0xFF00) >> 8);
                    for (let ii = 0; ii < this.message_length_received; ii++) {
                        this.message_checksum = crc8_dvb_s2(this.message_checksum, this.message_buffer_uint8_view[ii]);
                    }
                    this._dispatch_message(data[i]);
                    break;
                default:
                    console.log(`Unknown state detected: ${this.state}`);
            }
        }
    }

    private _initialize_read_buffer() {
        this.message_buffer = new ArrayBuffer(this.message_length_expected);
        this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
    }

    private _dispatch_message(expectedChecksum): void {
        let dataView: MspDataView;
        if (this.message_checksum === expectedChecksum) {
            // message received, store dataview
            dataView = new MspDataView(this.message_buffer, 0, this.message_length_expected);
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
        }

        this.push(message);
        this.reset();
    }

    private reset(): void {
        this.message_length_received = 0;
        this.state = DECODER_STATES.IDLE;
        this.messageIsJumboFrame = false;
        this.crcError = false;
    }

    public _flush(cb) {
        this.reset();
        cb()
    }
}
