/* eslint-disable @typescript-eslint/no-unused-vars */
import { PubSub, ApolloError } from "apollo-server";

const closeEvents = new PubSub();
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
  closeEvents.publish(connectionId, connectionId);
};

export const onClosed = (connectionId: string): AsyncIterator<string> => {
  return closeEvents.asyncIterator<string>(connectionId);
};

export const reset = (): void => undefined;
