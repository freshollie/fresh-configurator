import { MspDataView } from "../src";

describe("MspDataView", () => {
  describe("read8", () => {
    it("should read 8 bit integers from the array, in sequence", () => {
      const arrayBuffer = new ArrayBuffer(2);
      const bufferView = new Uint8Array(arrayBuffer);
      bufferView[0] = 15;
      bufferView[1] = 69;

      const dataView = new MspDataView(arrayBuffer, 0, arrayBuffer.byteLength);

      expect(dataView.read8()).toEqual(15);
      expect(dataView.read8()).toEqual(69);
    });

    it("should throw an error if there is no more data to read", () => {
      const arrayBuffer = new ArrayBuffer(2);
      const bufferView = new Uint8Array(arrayBuffer);
      bufferView[0] = 15;

      const dataView = new MspDataView(arrayBuffer, 0, arrayBuffer.byteLength);

      expect(dataView.read8()).toEqual(15);
      expect(dataView.read8()).toEqual(0);
      expect(() => dataView.read8()).toThrowErrorMatchingSnapshot();
    });
  });

  describe("read16", () => {
    it("should read 16 bit integers from the array, in sequence", () => {
      const arrayBuffer = new ArrayBuffer(4);
      const bufferView = new Uint8Array(arrayBuffer);
      bufferView[0] = 15;
      bufferView[1] = 69;
      bufferView[2] = 28;
      bufferView[3] = 96;

      const dataView = new MspDataView(arrayBuffer, 0, arrayBuffer.byteLength);

      expect(dataView.read16()).toEqual(17679);
      expect(dataView.read16()).toEqual(24604);
    });

    it("should throw an error if there is no more data to read", () => {
      const arrayBuffer = new ArrayBuffer(2);
      const bufferView = new Uint8Array(arrayBuffer);
      bufferView[0] = 15;
      bufferView[1] = 69;

      const dataView = new MspDataView(arrayBuffer, 0, arrayBuffer.byteLength);

      expect(dataView.read16()).toEqual(17679);
      expect(() => dataView.read16()).toThrowErrorMatchingSnapshot();
    });
  });
});
