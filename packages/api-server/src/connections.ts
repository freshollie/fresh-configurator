import { ApolloError } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";

const changeEvents = new PubSub();
const reconnectingEvents = new PubSub();

let connectionsMap: Record<string, string> = {};
let connectingAttempts: Record<string, Promise<void>> = {};

export const forPort = (port: string): string | undefined =>
  Object.entries(connectionsMap).find(
    ([, connection]) => port === connection
  )?.[0];

export const isConnecting = (port: string): boolean =>
  !!connectingAttempts[port];

export const getPort = (connectionId: string): string => {
  const port = connectionsMap[connectionId];

  if (!port) {
    throw new ApolloError("Connection is not active");
  }

  return port;
};

export const isOpen = (connectionId: string): boolean =>
  !!connectionsMap[connectionId];

export const connectLock = async (
  port: string,
  connectFunction: () => Promise<void>
): Promise<void> => {
  const lock = connectingAttempts[port];
  if (lock !== undefined) {
    return lock;
  }

  const connectPromise = connectFunction();
  connectingAttempts[port] = connectPromise;

  return connectPromise.finally(() => {
    if (connectingAttempts[port] === connectPromise) {
      delete connectingAttempts[port];
    }
  });
};

export const add = (port: string, connnectionId: string): void => {
  connectionsMap[connnectionId] = port;
};

export const close = (connectionId: string): void => {
  changeEvents.publish(connectionId, undefined);
  delete connectionsMap[connectionId];
};

export const setReconnecting = (
  connectionId: string,
  attempt: number
): void => {
  reconnectingEvents.publish(connectionId, attempt);
};

export const change = (connectionId: string, newConnectionId: string): void => {
  const port = connectionsMap[connectionId];
  if (port) {
    connectionsMap[newConnectionId] = port;
    delete connectionsMap[connectionId];
    changeEvents.publish(connectionId, newConnectionId);
  }
};

export const closeConnections = (port: string): void => {
  Object.entries(connectionsMap)
    .filter(([, connectionPort]) => port === connectionPort)
    .forEach(([connectionId]) => close(connectionId));
};

export const onChanged = (
  connectionId: string
): AsyncIterator<string | undefined> =>
  changeEvents.asyncIterator(connectionId);

export const onReconnecting = (connectionId: string): AsyncIterator<number> =>
  reconnectingEvents.asyncIterator(connectionId);

export const reset = (): void => {
  connectionsMap = {};
  connectingAttempts = {};
};
