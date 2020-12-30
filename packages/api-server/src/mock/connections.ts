/* eslint-disable @typescript-eslint/no-unused-vars */
import { PubSub, ApolloError } from "apollo-server-express";

const changeEvents = new PubSub();
const reconnectEvents = new PubSub();
const connectionsMap: Record<string, string | undefined> = {};

export const getPort = (connectionId: string): string => {
  const port = connectionsMap[connectionId];

  if (!port) {
    throw new ApolloError("Connection is not active");
  }

  return port;
};

export const isOpen = (connectionId: string): boolean =>
  !!connectionsMap[connectionId];

export const close = (connectionId: string): void => {
  changeEvents.publish(connectionId, undefined);
  connectionsMap[connectionId] = undefined;
};

export const change = (connectionId: string, newId: string): void => {
  connectionsMap[newId] = connectionsMap[connectionId];
  connectionsMap[connectionId] = undefined;
  changeEvents.publish(connectionId, newId);
};

export const setReconnecting = (
  connectionId: string,
  attempt: number
): void => {
  reconnectEvents.publish(connectionId, attempt);
};

export const connectLock = async (
  port: string,
  connectFunction: () => Promise<void>
): Promise<void> => connectFunction();

export const add = (port: string, connnectionId: string): void => {
  connectionsMap[connnectionId] = port;
};

export const closeConnections = (port: string): void => undefined;
export const closeConnection = (connectionId: string): void => {
  connectionsMap[connectionId] = undefined;
  close(connectionId);
};

export const onChanged = (
  connectionId: string
): AsyncIterator<string | undefined> => {
  return changeEvents.asyncIterator(connectionId);
};

export const onReconnecting = (connectionId: string): AsyncIterator<number> => {
  return reconnectEvents.asyncIterator(connectionId);
};

export const reset = (): void => undefined;
