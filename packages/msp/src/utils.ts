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
  return data
    .slice(start, end)
    .reduce((computed, byte) => crc8DvbS2(computed, byte), 0);
};
