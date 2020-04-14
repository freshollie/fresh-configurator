import { encodeMessageV1, encodeMessageV2 } from "../src/encoders";

describe("v1", () => {
  it("should encode v1 messages as expected", () => {
    expect(encodeMessageV1(15, Buffer.from("This is a message"))).toEqual(
      Buffer.from([
        "$".charCodeAt(0),
        "M".charCodeAt(0),
        "<".charCodeAt(0),
        17,
        15,
        84,
        104,
        105,
        115,
        32,
        105,
        115,
        32,
        97,
        32,
        109,
        101,
        115,
        115,
        97,
        103,
        101,
        8,
      ])
    );
  });

  it("should handle messages without data", () => {
    expect(encodeMessageV1(15)).toEqual(
      Buffer.from([
        "$".charCodeAt(0),
        "M".charCodeAt(0),
        "<".charCodeAt(0),
        0,
        15,
        15,
      ])
    );
  });
});

describe("v2", () => {
  it("should encode v2 messages as expected", () => {
    expect(encodeMessageV2(512, Buffer.from("This is a v2 message"))).toEqual(
      Buffer.from([
        "$".charCodeAt(0),
        "X".charCodeAt(0),
        "<".charCodeAt(0),
        0,
        0,
        2,
        20,
        0,
        84,
        104,
        105,
        115,
        32,
        105,
        115,
        32,
        97,
        32,
        118,
        50,
        32,
        109,
        101,
        115,
        115,
        97,
        103,
        101,
        1,
      ])
    );
  });

  it("should handle messages with no data", () => {
    expect(encodeMessageV2(512)).toEqual(
      Buffer.from([
        "$".charCodeAt(0),
        "X".charCodeAt(0),
        "<".charCodeAt(0),
        0,
        0,
        2,
        0,
        0,
        211,
      ])
    );
  });
});
