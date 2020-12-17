import { crc8DvbS2Data } from "./utils";

export const encodeMessageV1 = (code: number, data?: Buffer): Buffer => {
  let bufferOut;
  // always reserve 6 bytes for protocol overhead !
  if (data) {
    const size = data.length + 6;
    let checksum = 0;

    bufferOut = new ArrayBuffer(size);
    const bufView = new Uint8Array(bufferOut);

    bufView[0] = 36; // $
    bufView[1] = 77; // M
    bufView[2] = 60; // <
    bufView[3] = data.length;
    bufView[4] = code;

    checksum = bufView[3] ^ bufView[4];

    for (let i = 0; i < data.length; i += 1) {
      bufView[i + 5] = data[i]!;

      checksum ^= bufView[i + 5]!;
    }

    bufView[5 + data.length] = checksum;
  } else {
    bufferOut = new ArrayBuffer(6);
    const bufView = new Uint8Array(bufferOut);

    bufView[0] = 36; // $
    bufView[1] = 77; // M
    bufView[2] = 60; // <
    bufView[3] = 0; // data length
    bufView[4] = code; // code
    bufView[5] = bufView[3] ^ bufView[4]; // checksum
  }
  return Buffer.from(bufferOut);
};

export const encodeMessageV2 = (code: number, data?: Buffer): Buffer => {
  const dataLength = data ? data.length : 0;
  // 9 bytes for protocol overhead
  const bufferSize = dataLength + 9;
  const bufferOut = new ArrayBuffer(bufferSize);
  const bufView = new Uint8Array(bufferOut);
  bufView[0] = 36; // $
  bufView[1] = 88; // X
  bufView[2] = 60; // <
  bufView[3] = 0; // flag
  bufView[4] = code & 0xff;
  bufView[5] = (code >> 8) & 0xff;
  bufView[6] = dataLength & 0xff;
  bufView[7] = (dataLength >> 8) & 0xff;
  for (let i = 0; i < dataLength; i += 1) {
    bufView[8 + i] = data![i]!;
  }
  bufView[bufferSize - 1] = crc8DvbS2Data(bufView, 3, bufferSize - 1);
  return Buffer.from(bufferOut);
};
