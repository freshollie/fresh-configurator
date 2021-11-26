// EXECUTES IN A WEB WORKER
/* eslint-disable no-restricted-globals */
import {
  context,
  mockedDeviceContext,
  schema,
  startMockDevice,
} from "@betaflight/api-graph";
import { initialiseSerialBackend } from "@betaflight/api";
import WSABinding from "serialport-binding-webserialapi";
import {
  createMessageBusLinkBackend,
  webWorkerBus,
  createSchemaExecutor,
} from "../shared/apollo-messagebus-link";
import { SchemaBackendInitArgs } from "../shared/types";

const backend = createMessageBusLinkBackend<SchemaBackendInitArgs>({
  registerBus: webWorkerBus(self),
  createExecutor: async (args) => {
    if (args.mocked) {
      startMockDevice();
    } else {
      await initialiseSerialBackend(WSABinding);
    }

    const executor = createSchemaExecutor({
      schema,
      context: (args.mocked ? mockedDeviceContext : context)({
        artifactsDir: "/",
      }),
    });
    return executor;
  },
});

backend.listen();
