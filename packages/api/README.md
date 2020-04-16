# `@betaflight/api`
> A high level api for Betaflight

Betaflight api is a package built on top of the MSP protocol to
provide a high level API to query objects and values from betaflight 
flight controllers, managing backwards compatibilty, and providing type 
information.

This library should be used if you want to write a user interface or query
data specifically from betaflight flight controllers. This library
is not gaurenteed to work with other types of flight controller.

Please see `@betaflight/api-server` for an even higher level graph based 
api for betaflight flight controllers.

**PLEASE NOTE: THIS API IS CHANGING ALL THE TIME, IT IS NOT RECOMMENDED FOR PRODUCTION USAGE YET**

## Usage

```bash
$ yarn add @beteflight/api
```

```typescript
import { ports, open, close, apiVersion, readFeatures, readAttitude, readGps } from "@betaflight/api";

(async () => {
  const portsList = await ports();

  console.log(portsList);

  const port = portsList[0];

  // Connect to the device, estabilsh it's an MSP device and read its API version
  await open(port, () => {
    console.log("Closed callback")
  });
  console.log(apiVersion(port));

  consolt.log(await readFeatures(port));

  while (true) {
    console.log(Promise.all([
      readAttitude(port),
      readAnalogValues(port)
    ]);
    ...
  }

  // Close the port when you are done with it
  await close(port)
})();
```