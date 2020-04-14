# `@betaflight/msp`

> MultiWii serial protocol api

A library to handle reading and writing data from flight controllers
which use the MultiWii Serial Protocol.

## Usage

```typescript
import { ports, open, execute, close } from "@betaflight/msp";

(async () => {
  const portsList = await ports();

  console.log(portsList);

  const port = portsList[0];

  // Connect to the device, estabilsh it's an MSP device and read its API version
  await open(port);
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
