import { PubSub } from "apollo-server";
import { Mutex } from "async-mutex";

const closeEvents = new PubSub();
const connectionsMap: Record<string, string | undefined> = {};
const connectingLocks: Record<string, Mutex | undefined> = {};

export const getPort = (connnectionId: string): string | undefined =>
  connectionsMap[connnectionId];

export const lock = async <T>(
  port: string,
  lockFunction: () => Promise<T>
): Promise<T> => {
  const mutex = connectingLocks[port] ?? new Mutex();
  connectingLocks[port] = mutex;

  const release = await mutex.acquire();
  try {
    const result = await lockFunction();
    release();
    return result;
  } catch (e) {
    release();
    throw e;
  }
};

export const add = (port: string, connnectionId: string): void => {
  connectionsMap[connnectionId] = port;
};

export const remove = (port: string): void => {
  Object.entries(connectionsMap).forEach(([connectionId, connectionPort]) => {
    if (port === connectionPort) {
      closeEvents.publish(connectionId, connectionId);
      connectionsMap[connectionId] = undefined;
    }
  });
};

export const onClosed = (connectionId: string): AsyncIterator<string> => {
  return closeEvents.asyncIterator<string>(connectionId);
};
