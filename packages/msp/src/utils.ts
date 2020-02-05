/* eslint-disable no-bitwise */
export const crc8DvbS2 = (currCRC: number, ch: number): number => {
  let crc = currCRC;
  crc ^= ch;
  for (let ii = 0; ii < 8; ii += 1) {
    if (crc & 0x80) {
      crc = ((crc << 1) & 0xff) ^ 0xd5;
    } else {
      crc = (crc << 1) & 0xff;
    }
  }
  return crc;
};

export const crc8DvbS2Data = (
  data: Uint8Array,
  start: number,
  end: number
): number => {
  let crc = 0;
  for (let i = start; i < end; i += 1) {
    crc = crc8DvbS2(crc, data[i]);
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

  public buffer(): ArrayBuffer {
    return this.dataView.buffer;
  }

  public readU8(): number {
    if (this.dataView.byteLength >= this.offset + 1) {
      this.offset += 1;
      return this.dataView.getUint8(this.offset);
    }
    return MspDataView.error();
  }

  public readU16(): number {
    if (this.dataView.byteLength >= this.offset + 2) {
      return this.readU8() + this.readU8() * 256;
    }
    return MspDataView.error();
  }

  public readU32(): number {
    if (this.dataView.byteLength >= this.offset + 4) {
      return this.readU16() + this.readU16() * 65536;
    }
    return MspDataView.error();
  }

  public read8(): number {
    if (this.dataView.byteLength >= this.offset + 1) {
      this.offset += 1;
      return this.dataView.getInt8(this.offset);
    }
    return MspDataView.error();
  }

  public read16(): number {
    this.offset += 2;
    if (this.dataView.byteLength >= this.offset) {
      return this.dataView.getInt16(this.offset - 2, true);
    }
    return MspDataView.error();
  }

  public read32(): number {
    this.offset += 4;
    if (this.dataView.byteLength >= this.offset) {
      return this.dataView.getInt32(this.offset - 4, true);
    }
    return MspDataView.error();
  }

  public remaining(): number {
    return this.dataView.byteLength - this.offset;
  }

  private static error(): never {
    throw new Error("Data depleated");
  }
}
