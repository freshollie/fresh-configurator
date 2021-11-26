import MessageBusLink from "./core/MessageBusLink";
import { RegisterBusFunction } from "./core/MessageBusLinkBackend";
import { DefaultInitArgs } from "./types";

export const webWorkerBus =
  <A = DefaultInitArgs>(
    workerSelf: typeof globalThis
  ): RegisterBusFunction<A> =>
  (request) => {
    // eslint-disable-next-line no-param-reassign
    workerSelf.onmessage = (event) =>
      request(event.data, (response) => workerSelf.postMessage(response));
  };

export const createMessageBusWebWorkerLink = <A = DefaultInitArgs>(
  worker: Worker
): MessageBusLink<A> =>
  new MessageBusLink({
    requestHandler: (request) => worker.postMessage(request),
    registerResponseHandler: (handler) => {
      // eslint-disable-next-line no-param-reassign
      worker.onmessage = (event) => handler(event.data);
    },
  });
