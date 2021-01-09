import React from "react";
import {
  MockedProvider,
  MockedResponse,
  MockSubscriptionLink,
} from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { InMemoryCache } from "@apollo/client";
import { render, waitFor, fireEvent } from "../test-utils";
import {
  ConnectDocument,
  DisconnectDocument,
} from "../gql/mutations/Connection.graphql";
import { OnConnectionChangedDocument } from "../gql/queries/Connection.graphql";
import {
  ConnectionStateDocument,
  LogsDocument,
} from "../gql/queries/Configurator.graphql";
import { SetArmingDocument } from "../gql/mutations/Device.graphql";
import { Connection } from "../gql/__generated__";
import ConnectionManager from "./ConnectionManager";
import { cache as clientCache, resolvers } from "../gql/client";

const connectMock = (
  port: string,
  baudRate: number,
  connectionId: string,
  apiVersion: string,
  onConnect = () => {}
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
  delay: 100,
});

const connectErrorMock = (port: string, baudRate: number): MockedResponse => ({
  request: {
    query: ConnectDocument,
    variables: {
      port,
      baudRate,
    },
  },
  error: new Error("some error"),
  delay: 100,
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
        close: connectionId,
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

const onChangedMock = (
  connectionId: string,
  response: string | null,
  onSubscribed = () => {}
): MockedResponse => ({
  request: {
    query: OnConnectionChangedDocument,
    variables: {
      connection: connectionId,
    },
  },
  delay: 99999,
  result: () => {
    onSubscribed();
    return {
      data: {
        onConnectionChanged: response,
      },
    };
  },
});

const connectionState = (
  cache: InMemoryCache
): { connecting: boolean; connection?: string | null } =>
  cache.readQuery({
    query: ConnectionStateDocument,
  })!.configurator;

const logs = (cache: InMemoryCache) =>
  cache
    .readQuery({ query: LogsDocument })!
    .configurator.logs.map((line) => line.message);

describe("ConnectionManager", () => {
  it("should connect with the connection settings and set the new connection id when connect clicked", async () => {
    const connect = jest.fn();
    const setDisarmed = jest.fn();
    const mockConnectionId = "23455";

    const cache = clientCache();
    const { getByTestId, asFragment } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
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
          onChangedMock(mockConnectionId, null),
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

    // expect disconnect button
    expect(getByTestId("disconnect-button")).toBeVisible();
    expect(asFragment()).toMatchSnapshot();

    // The correct things should have been logged
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should close the connection when the disconnect button is clicked", async () => {
    const mockConnectionId = "435345";
    const disconnect = jest.fn();

    const cache = clientCache();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
          connecting: false,
          connection: mockConnectionId,
          port: "/dev/something",
          baudRate: 115200,
        })}
        mocks={[
          onChangedMock(mockConnectionId, null),
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

    expect(logs(cache)).toMatchSnapshot();
  });

  it("should remove the connection when onConnectionChanged event occurs for the active connection with no new connectionId", async () => {
    const mockConnectionId = "238478234";
    const cache = clientCache();
    const mockSubscriptions = new MockSubscriptionLink();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
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
          onConnectionChanged: null,
        },
      },
    });
    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    expect(connectionState(cache).connection).toBeNull();
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should update the connectionId when onConnectionChanged event occurs for the active connection with a new connectionId", async () => {
    const mockConnectionId = "238478234";
    const cache = clientCache();
    const mockSubscriptions = new MockSubscriptionLink();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
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
          onConnectionChanged: "new-id",
        },
      },
    });
    await waitFor(() =>
      expect(connectionState(cache).connection).toBe("new-id")
    );
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should remove the active connection if onConnectionChanged event subscription fails", async () => {
    const mockConnectionId = "238478234";
    const cache = clientCache();
    const mockSubscriptions = new MockSubscriptionLink();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
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
        errors: [new GraphQLError("Some error")],
      },
    });
    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    expect(connectionState(cache).connection).toBeNull();
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should handle failing to connect", async () => {
    const cache = clientCache();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
          connecting: false,
          connection: null,
          port: "/dev/something",
          baudRate: 5050,
        })}
        mocks={[connectErrorMock("/dev/something", 5050)]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    fireEvent.click(getByTestId("connect-button"));

    await waitFor(() => expect(connectionState(cache).connecting).toBeTruthy());

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    expect(connectionState(cache).connecting).toBeFalsy();
    expect(connectionState(cache).connection).toBeNull();
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should close the connection if api version is less than minimum version", async () => {
    const connect = jest.fn();
    const disconnect = jest.fn();
    const mockConnectionId = "23432423";

    const cache = clientCache();
    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
          connecting: false,
          connection: null,
          port: "/dev/something",
          baudRate: 5050,
        })}
        mocks={[
          connectMock(
            "/dev/something",
            5050,
            mockConnectionId,
            "1.0.1",
            connect
          ),
          disconnectMock(mockConnectionId, disconnect),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    fireEvent.click(getByTestId("connect-button"));

    await waitFor(() => expect(connectionState(cache).connecting).toBeTruthy());
    await waitFor(() => expect(connect).toHaveBeenCalled());

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    expect(disconnect).toHaveBeenCalled();
    expect(connectionState(cache).connecting).toBeFalsy();
    expect(connectionState(cache).connection).toBeNull();
    expect(logs(cache)).toMatchSnapshot();
  });

  it("should handle aborting connection attempts", async () => {
    const disconnect = jest.fn();
    const setDisarmed = jest.fn();
    const mockConnectionId1 = "435543";
    const mockConnectionId2 = "243455";

    const cache = clientCache();

    const { getByTestId } = render(
      <MockedProvider
        cache={cache}
        resolvers={resolvers({
          connecting: false,
          connection: null,
          port: "/dev/something",
          baudRate: 115200,
        })}
        key={1}
        mocks={[
          connectMock("/dev/something", 115200, mockConnectionId1, "1.40.1"),
          disconnectMock(mockConnectionId1, disconnect),
          connectMock("/dev/something", 115200, mockConnectionId2, "1.40.1"),
          onChangedMock(mockConnectionId2, null),
          setArmingMock(mockConnectionId2, true, false, setDisarmed),
        ]}
      >
        <ConnectionManager />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    fireEvent.click(getByTestId("connect-button"));

    fireEvent.click(await waitFor(() => getByTestId("disconnect-button")));
    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    await waitFor(() => expect(disconnect).toHaveBeenCalled());

    await waitFor(() => expect(getByTestId("connect-button")).toBeVisible());
    fireEvent.click(getByTestId("connect-button"));

    await waitFor(() => expect(getByTestId("disconnect-button")).toBeVisible());
    await waitFor(() =>
      expect(connectionState(cache).connection).toEqual(mockConnectionId2)
    );
    await waitFor(() => expect(setDisarmed).toHaveBeenCalled());
    expect(connectionState(cache).connecting).toBeFalsy();

    // The correct things should have been logged
    expect(logs(cache)).toMatchSnapshot();
  });
});
