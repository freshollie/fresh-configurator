export const crc8_dvb_s2 = (crc: number, ch: number): number => {
  crc ^= ch;
  for (let ii = 0; ii < 8; ii++) {
    if (crc & 0x80) {
      crc = ((crc << 1) & 0xff) ^ 0xd5;
    } else {
      crc = (crc << 1) & 0xff;
    }
  }
  return crc;
};

export const crc8_dvb_s2_data = (
  data: Uint8Array,
  start: number,
  end: number
): number => {
  let crc = 0;
  for (let ii = start; ii < end; ii++) {
    crc = crc8_dvb_s2(crc, data[ii]);
  }
  return crc;
};

export class MspDataView {
  private dataView: DataView;
  private offset = 0;
  constructor(
    buffer: ArrayBufferLike,
    byteOffset?: number,
    byteLength?: number
  ) {
    this.dataView = new DataView(buffer, byteOffset, byteLength);
  }

  public buffer(): Buffer {
    return Buffer.from(this.dataView.buffer);
  }

  public readU8() {
    if (this.dataView.byteLength >= this.offset + 1) {
      return this.dataView.getUint8(this.offset++);
    } else {
      this.error();
    }
  }

  public readU16() {
    if (this.dataView.byteLength >= this.offset + 2) {
      return this.readU8() + this.readU8() * 256;
    } else {
      this.error();
    }
  }

  public readU32() {
    if (this.dataView.byteLength >= this.offset + 4) {
      return this.readU16() + this.readU16() * 65536;
    } else {
      this.error();
    }
  }

  public read8() {
    if (this.dataView.byteLength >= this.offset + 1) {
      return this.dataView.getInt8(this.offset++);
    } else {
      this.error();
    }
  }

  public read16() {
    this.offset += 2;
    if (this.dataView.byteLength >= this.offset) {
      return this.dataView.getInt16(this.offset - 2, true);
    } else {
      this.error();
    }
  }

  public read32() {
    this.offset += 4;
    if (this.dataView.byteLength >= this.offset) {
      return this.dataView.getInt32(this.offset - 4, true);
    } else {
      this.error();
    }
  }

  public remaining() {
    return this.dataView.byteLength - this.offset;
  }

  private error(): never {
    throw new Error("Data depleated");
  }
}
