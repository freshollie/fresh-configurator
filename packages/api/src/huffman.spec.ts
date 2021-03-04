import { huffmanDecodeBuffer } from "./huffman";

describe("huffman", () => {
  it("can decode", () => {
    expect(
      huffmanDecodeBuffer(
        //             7      55            112
        //             011011+00    1101000+0    00111110    1
        Buffer.from([0b011011_00, 0b1101000_0, 0b00111110, 0b10000000]),
        3
      )
    ).toEqual(Buffer.from([7, 55, 112]));
  });
});
