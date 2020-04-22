import React from "react";
import { Resolvers } from "apollo-client";
import {
  MockedProvider,
  MockedResponse,
  MockSubscriptionLink,
} from "@apollo/react-testing";
import { InMemoryCache } from "apollo-cache-inmemory";
import { render, waitFor, fireEvent } from "../test-utils";
import {
  ConnectDocument,
  DisconnectDocument,
} from "../gql/mutations/Connection.graphql";
import { OnConnectionClosedDocument } from "../gql/queries/Connection.graphql";
import {
  ConnectionStateDocument,
  ConnectionStateQuery,
} from "../gql/queries/Configurator.graphql";
import { SetArmingDocument } from "../gql/mutations/Device.graphql";
import { Connection } from "../gql/__generated__";
import { ApolloContext } from "../gql/apollo";
import ConnectionManager from "./ConnectionManager";

let logs: string[] = [];

const configuratorState = (state: {
  connecting?: boolean;
  connection?: string | null;
  port?: string;
  baudRate?: number;
}): Resolvers => ({
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
    setConnection: (_, { connection }, { client }: ApolloContext) => {
      client.writeData({
        data: {
          configurator: {
            __typename: "Configurator",
            connection,
          },
        },
      });
      return null;
    },
    setConnecting: (_, { value }, { client }: ApolloContext) => {
      client.writeData({
        data: {
          configurator: {
            __typename: "Configurator",
            connecting: value,
          },
        },
      });
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

const disconnectMock = (
  connectionId: string,
  onDisconnect: () => void
): MockedResponse => ({
  request: {
    query: DisconnectDocument,
    variables: {
      connection: connectionId,
    },
  },
  result: () => {
    onDisconnect();
    return {
      data: {
        close: null,
      },
    };
  },
});

const setArmingMock = (
  connection: string,
  armingDisabled: boolean,
  runawayTakeoffPreventionDisabled: boolean,
  onSet: () => void
): MockedResponse => ({
  request: {
    query: SetArmingDocument,
    variables: {
      connection,
      armingDisabled,
      runawayTakeoffPreventionDisabled,
    },
  },
  result: () => {
    onSet();
    return {
      data: {
        deviceSetArming: null,
      },
    };
  },
});

const onClosedMock = (
  connectionId: string,
  response: string | null,
  onSubscribed: () => void
): MockedResponse => ({
  request: {
    query: OnConnectionClosedDocument,
    variables: {
      connection: connectionId,
    },
  },
  result: () => {
    onSubscribed();
    return {
      data: {
        onClosed: response,
      },
    };
  },
});

beforeEach(() => {
  logs = [];
});

const connectionState = (
  cache: InMemoryCache
): { connecting: boolean; connection?: string | null } =>
  cache.readQuery<ConnectionStateQuery>({
    query: ConnectionStateDocument,
  })!.configurator;

describe("ConnectionManager", () => {
  it("should connect with the connection settings and set the new connection id when connect clicked", async () => {
    const connect = jest.fn();
    const setDisarmed = jest.fn();
    const onSubscribed = jest.fn();
    const mockConnectionId = "23455";

    const cache = new InMemoryCache();
    const { getByTestId, asFragment } = render(
      <MockedProvider
        cache={cache}
        resolvers={configuratorState({
          connecting: false,
          connection: null,
          port: "/dev/something",
          baudRate: 115200,
        })}
        mocks={[
          connectMock(
            "/dev/something",
            115200,
            mockConnectionId,
            "1.40.1",
            connect
          ),
          onClosedMock(mockConnectionId, null, onSubscribed),
          setArmingMock(mockConnectionId, true, false, setDisarmed),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());

    // expect the button to look correct
    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(getByTestId("connect-button"));

    await waitFor(() => expect(connectionState(cache).connecting).toBeTruthy());
    expect(getByTestId("disconnect-button")).toBeVisible();

    // expect the button to have connecting text
    expect(asFragment()).toMatchSnapshot();

    await waitFor(() => expect(connect).toHaveBeenCalled());
    await waitFor(() =>
      expect(connectionState(cache).connection).toEqual(mockConnectionId)
    );
    await waitFor(() => expect(setDisarmed).toHaveBeenCalled());
    expect(connectionState(cache).connecting).toBeFalsy();
    expect(onSubscribed).toHaveBeenCalled();

    // expect disconnect button
    expect(getByTestId("disconnect-button")).toBeVisible();
    expect(asFragment()).toMatchSnapshot();

    // The correct things should have been logged
    expect(logs).toMatchSnapshot();
  });

  it("should close the active connection when onClosed event occurs for the active connection", async () => {
    const mockConnectionId = "238478234";
    const cache = new InMemoryCache();
    const mockSubscriptions = new MockSubscriptionLink();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={configuratorState({
          connecting: false,
          connection: mockConnectionId,
          port: "/dev/something",
          baudRate: 115200,
        })}
        link={mockSubscriptions}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("disconnect-button")).toBeVisible());
    mockSubscriptions.simulateResult({
      result: {
        data: {
          onClosed: mockConnectionId,
        },
      },
    });
    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    expect(connectionState(cache).connection).toBeNull();
    expect(logs).toMatchSnapshot();
  });

  it("should close the connection when the disconnect button is clicked", async () => {
    const mockConnectionId = "435345";
    const disconnect = jest.fn();

    const cache = new InMemoryCache();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={configuratorState({
          connecting: false,
          connection: mockConnectionId,
          port: "/dev/something",
          baudRate: 115200,
        })}
        mocks={[
          onClosedMock(mockConnectionId, null, () => {}),
          disconnectMock(mockConnectionId, disconnect),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("disconnect-button")).toBeVisible());
    fireEvent.click(getByTestId("disconnect-button"));

    await waitFor(() => expect(disconnect).toHaveBeenCalled());
    expect(connectionState(cache).connection).toBeNull();
    expect(connectionState(cache).connecting).toBeFalsy();

    expect(logs).toMatchSnapshot();
  });
});
