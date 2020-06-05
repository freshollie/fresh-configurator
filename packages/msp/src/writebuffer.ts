export default class WriteBuffer extends Array<number> {
  public push8(val: number): WriteBuffer {
    this.push(0xff & val);
    return this;
  }

  public push16(val: number): WriteBuffer {
    // low byte
    this.push(0x00ff & val);
    // high byte
    this.push(val >> 8);
    // chainable
    return this;
  }

  public push32(val: number): WriteBuffer {
    this.push8(val)
      .push8(val >> 8)
      .push8(val >> 16)
      .push8(val >> 24);
    return this;
  }
}
