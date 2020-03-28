/**
 * Helpful custom DataView class with extra methods.
 *
 * Adapted from:
 * https://github.com/betaflight/betaflight-configurator/src/js/injected_methods.js
 */
export default class MspDataView extends DataView {
  private offset = 0;

  public readU8(): number {
    if (this.byteLength >= this.offset + 1) {
      this.offset += 1;
      return this.getUint8(this.offset - 1);
    }
    return MspDataView.error();
  }

  public readU16(): number {
    if (this.byteLength >= this.offset + 2) {
      return this.readU8() + this.readU8() * 256;
    }
    return MspDataView.error();
  }

  public readU32(): number {
    if (this.byteLength >= this.offset + 4) {
      return this.readU16() + this.readU16() * 65536;
    }
    return MspDataView.error();
  }

  public read8(): number {
    if (this.byteLength >= this.offset + 1) {
      this.offset += 1;
      return this.getInt8(this.offset);
    }
    return MspDataView.error();
  }

  public read16(): number {
    this.offset += 2;
    if (this.byteLength >= this.offset) {
      return this.getInt16(this.offset - 2, true);
    }
    return MspDataView.error();
  }

  public read32(): number {
    this.offset += 4;
    if (this.byteLength >= this.offset) {
      return this.getInt32(this.offset - 4, true);
    }
    return MspDataView.error();
  }

  public remaining(): number {
    return this.byteLength - this.offset;
  }

  private static error(): never {
    throw new Error("Data depleated");
  }
}
