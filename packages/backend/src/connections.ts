import { PubSub } from "apollo-server";

const connections = new PubSub();
const connectionsMap: Record<string, string | undefined> = {};
const connectingLocks: Record<string, Promise<unknown> | undefined> = {};

export const getPort = (connnectionId: string): string | undefined =>
  connectionsMap[connnectionId];

export const lock = async <T>(
  port: string,
  lockFunction: () => Promise<T>
): Promise<T> => {
  await (connectingLocks[port] ?? Promise.resolve());

  const result = lockFunction();
  connectingLocks[port] = result;
  return result;
};

export const add = (port: string, connnectionId: string): void => {
  connectionsMap[connnectionId] = port;
};

export const remove = (port: string): void => {
  Object.entries(connectionsMap).forEach(([connectionId, connectionPort]) => {
    if (port === connectionPort) {
      connectionsMap[connectionId] = undefined;
      connections.publish(connectionId, false);
    }
  });
};

export const subscribe = (connectionId: string): unknown => {
  connections.publish(connectionId, connectionsMap[connectionId]);
  return connections.asyncIterator(connectionId);
};
