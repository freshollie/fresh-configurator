# `@fresh/msp`

> MultiWii serial parser

A library to handle reading and writing data from flight controllers
which use the MultiWii Serial Protocol. This library has been written for
the betaflight MultiWii API,

## Usage

```typescript
import { ports, open, readAttitude, close } from "@fresh/msp";

(async () => {
  const portsList = await ports();

  console.log(portsList);

  const port = portsList[0];

  // Connect to the device, estabilsh it's an MSP device and its API version
  await open(port);

  while (true) {
    const attitude = await readAttitude(port);

    ...
  }

  // Close the port when you are done with it
  await close(port)
})();
```

This MSP library supports sending multiple commands in parrallel:

```typescript
const [osdConfig, rcTuningConfig] = await Promise.all([
  readOSDConfig(port),
  readRCTuning(port),
]);
```
