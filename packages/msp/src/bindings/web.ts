import AbstractBinding, {
  OpenOptions,
  PortInfo,
} from "@serialport/binding-abstract";

export default class WebBinding extends AbstractBinding {
  private device?: USBDevice;

  public static list(): Promise<PortInfo[]> {
    return navigator.usb.getDevices().then((list) =>
      list.map((device) => ({
        path: `/${device.vendorId}/${device.productId}/${device.productName}`,
        productId: device.productId.toString(),
        vendorId: device.vendorId.toString(),
        manufacturer: device.manufacturerName,
      }))
    );
  }

  public get isOpen(): boolean {
    return this.device?.opened ?? false;
  }

  public async open(path: string, options: OpenOptions): Promise<void> {
    await super.open(path, options);
    const [vendorId, productId] = path.split("/");
    const device = await navigator.usb.requestDevice({
      filters: [{ productId: Number(productId), vendorId: Number(vendorId) }],
    });
    await device.open();
    if (device.configuration?.configurationValue !== 1) {
      await device.selectConfiguration(1);
    }
    await device.claimInterface(2);
    await device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x01,
      index: 0x02,
    });

    this.device = device;
  }

  public async read(
    buffer: Buffer,
    offset: number,
    length: number
  ): Promise<{ bytesRead: number; buffer: Buffer }> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      await super.read(buffer, offset, length);
      // eslint-disable-next-line no-await-in-loop
      const result = await this.device!.transferIn(5, length).catch((e) => {
        if (this.isOpen) {
          return { status: "ok", data: undefined };
        }
        e.disconnect = true;
        throw e;
      });

      const bytesRead = result.data?.byteLength ?? 0;
      if (bytesRead > 0 && result.data) {
        buffer.write(Buffer.from(result.data.buffer).toString(), offset);
        return { bytesRead, buffer };
      }

      if (result.status !== "ok" && !this.isOpen) {
        const err = new Error("Port is not open") as Error & {
          canceled: boolean;
        };
        err.canceled = true;
        throw err;
      }
    }
  }

  public async close(): Promise<void> {
    await this.close();
    await this.device!.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x00,
      index: 0x02,
    });
    await this.device!.close();
  }
}
