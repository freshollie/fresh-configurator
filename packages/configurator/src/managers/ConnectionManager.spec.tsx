import React from "react";
import { Resolvers } from "apollo-client";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { InMemoryCache } from "apollo-cache-inmemory";
import { render, waitFor, fireEvent } from "../test-utils";
import { ConnectDocument } from "../gql/mutations/Connection.graphql";
import { Connection } from "../gql/__generated__";
import ConnectionManager from "./ConnectionManager";

let logs: string[] = [];

const configuratorState = (
  state: {
    connecting?: boolean;
    connection?: string | null;
    port?: string;
    baudRate?: number;
  },
  onConnectionSet = (connection: string) => connection,
  onConnectingSet = (value: boolean) => value
): Resolvers => ({
  Query: {
    configurator: () => ({
      __typename: "Configurator",

      port: "",
      baudRate: 115200,
      connecting: false,
      connection: null,

      ...state,
    }),
  },
  Mutation: {
    setConnection: (_, { connection }) => {
      onConnectionSet(connection);
      return null;
    },
    setConnecting: (_, { value }) => {
      onConnectingSet(value);
      return null;
    },
    log: (_, { message }) => {
      logs.push(message);
      return null;
    },
  },
});

const connectMock = (
  port: string,
  baudRate: number,
  connectionId: string,
  apiVersion: string,
  onConnect: () => void
): MockedResponse => ({
  request: {
    query: ConnectDocument,
    variables: {
      port,
      baudRate,
    },
  },
  result: () => {
    onConnect();

    return {
      data: {
        connect: {
          id: connectionId,
          apiVersion,
          __typename: "Connection",
        } as Connection,
      },
    };
  },
});

beforeEach(() => {
  logs = [];
});

describe("ConnectionManager", () => {
  xit("should connect with the connection settings and set the new connection id when connect clicked", async () => {
    const connect = jest.fn();
    const setConnecting = jest.fn();
    const setConnection = jest.fn();
    const mockConnectionId = "23455";

    const cache = new InMemoryCache({
      resultCaching: false,
    });

    const { getByTestId, asFragment, getByText, rerender } = render(
      <MockedProvider
        cache={cache}
        resolvers={configuratorState(
          {
            connecting: false,
            connection: null,
            port: "/dev/something",
            baudRate: 115200,
          },
          setConnection,
          setConnecting
        )}
        mocks={[
          connectMock(
            "/dev/something",
            115200,
            mockConnectionId,
            "1.40.1",
            connect
          ),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("connect")).toBeEnabled());

    // expect the button to look correct
    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(getByTestId("connect"));

    await waitFor(() => expect(setConnecting).toHaveBeenCalledWith(true));

    cache.reset();
    rerender(
      <MockedProvider
        cache={cache}
        resolvers={configuratorState(
          {
            connecting: true,
            connection: null,
            port: "/dev/something",
            baudRate: 115200,
          },
          setConnection,
          setConnecting
        )}
        mocks={[
          connectMock(
            "/dev/something",
            115200,
            mockConnectionId,
            "1.40.1",
            connect
          ),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );
    await waitFor(() => expect(getByText("Connecting")).toBeVisible());
    await waitFor(() => expect(connect).toHaveBeenCalled());
    await waitFor(() =>
      expect(setConnection).toHaveBeenCalledWith(mockConnectionId)
    );

    expect(logs).toMatchSnapshot();
  });
});
