import { crc8_dvb_s2_data } from "./utils";

export const encode_message_v1 = (
  code: number,
  data?: number[]
): ArrayBuffer => {
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
};

export const encode_message_v2 = (
  code: number,
  data?: number[]
): ArrayBuffer => {
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
  for (let ii = 0; ii < dataLength; ii++) {
    bufView[8 + ii] = data![ii];
  }
  bufView[bufferSize - 1] = crc8_dvb_s2_data(bufView, 3, bufferSize - 1);
  return bufferOut;
};
