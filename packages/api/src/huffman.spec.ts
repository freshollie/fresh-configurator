import { huffmanDecodeBuffer } from "./huffman";

describe("huffmanDecodeBuffer", () => {
  it("should decode correctly", () => {
    expect(
      huffmanDecodeBuffer(
        //             7      55            112
        //             011011+00    1101000+0    00111110    1
        Buffer.from([0b011011_00, 0b1101000_0, 0b00111110, 0b10000000]),
        3
      )
    ).toEqual(Buffer.from([7, 55, 112]));
  });

  it("should stop after huffman eof is received", () => {
    expect(
      huffmanDecodeBuffer(
        // prettier-ignore
        //             7      55            112                EOF              7
        //             011011+00    1101000+0    00111110    1+0000000    00000+011    011
        Buffer.from([0b011011_00, 0b1101000_0, 0b00111110, 0b1_0000000, 0b00000_011, 0b01100000]),
        5
      )
    ).toEqual(Buffer.from([7, 55, 112]));
  });
});
