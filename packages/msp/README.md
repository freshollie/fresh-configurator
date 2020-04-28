# `@betaflight/msp`

> MultiWii serial protocol api

A library to handle reading and writing data from flight controllers
which use the MultiWii Serial Protocol.

This library has good test coverage of main functionality.

## Usage

```bash
$ yarn add @betaflight/msp
```

```typescript
import { ports, open, execute, close, bytesRead, bytesWritten } from "@betaflight/msp";

(async () => {
  const portsList = await ports();

  console.log(portsList);

  const port = portsList[0];

  // Connect to the device, establish it's an MSP device and read its API version
  await open(port, () => {
    console.log("onClosed");
  });
  console.log(apiVersion(port));

  while (true) {
    const data = await execute(port, {code: 1 });
    console.log(data.readU8());
    ...
  }

  // Close the port when you are done with it
  await close(port)
})();
```

This MSP library supports sending multiple commands in parallel:

```typescript
const [data1, data2] = await Promise.all([
  execute(port, {code: 1 }),
  execute(port, {code: 2 }),
]);
```

Stats from the connection, and is used by `@betaflight/configurator`
 
```typescript
import { open, execute, bytesRead, bytesWritten, packetErrors, WriteBuffer } from "@betaflight/msp";

(async () => {
  await open("/dev/someport");

  const buffer = new WriteBuffer();
  buffer.pushU8(15);
  await execute("/dev/someport", { code: 2, data: buffer });

  console.log(bytesRead("/dev/somport"))
  console.log(bytesWritten("/dev/somport"));
  console.log(packetErrors("/dev/someport"));
})();
