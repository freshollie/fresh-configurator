import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import flushPromises from "flush-promises";
import { mockApi } from "./mocks";
import { createServer } from "../src";
import {
  reset,
  getPort,
  isOpen,
  add,
  onChanged,
  onReconnecting,
} from "../src/connections";

const { apolloServer } = createServer();

afterEach(() => {
  jest.useRealTimers();
  reset();
});

describe("connections", () => {
  describe("connect", () => {
    it("should initialise a connection on the given port with given baudrate", async () => {
      const { mutate } = createTestClient(apolloServer);

      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data, errors } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
              apiVersion
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      expect(errors).toBeFalsy();
      expect(data?.connect).toEqual({
        id: expect.any(String),
        apiVersion: "1.32.0",
      });
      expect(mockApi.open).toHaveBeenCalledWith(
        "/dev/someport",
        {
          baudRate: 99922,
        },
        expect.anything()
      );
      expect(getPort(data?.connect.id)).toEqual("/dev/someport");
    });

    it("should return a unique connection id for every connection", async () => {
      const { mutate } = createTestClient(apolloServer);
      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data: connection1 } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      const { data: connection2 } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      expect(connection1?.connect.id).not.toEqual(connection2?.connect.id);
    });

    it("should close existing connections when a new connection comes in for the same port", async () => {
      const { mutate } = createTestClient(apolloServer);
      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data: connection1 } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      const { data: connection2 } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      expect(isOpen(connection1?.connect.id)).toBeFalsy();
      expect(getPort(connection2?.connect.id)).toEqual("/dev/someport");
    });

    it("should handle connection failing to open", async () => {
      const { mutate } = createTestClient(apolloServer);
      mockApi.open.mockRejectedValue(new Error("Some error"));
      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { errors } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
            }
          }
        `,
        variables: {
          port: "/dev/someport",
          baudRate: 99922,
        },
      });

      expect(errors).toBeTruthy();
    });

    it("should attempt to reconnect if the connection is lost", async () => {
      const { mutate } = createTestClient(apolloServer);

      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data, errors } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
              apiVersion
            }
          }
        `,
        variables: {
          port: "/dev/someotherport",
          baudRate: 99922,
        },
      });

      const connectionId = data?.connect.id;

      let newConnectionId = "";
      let attemptNumber = 0;

      onChanged(connectionId)
        .next()
        .then((newId) => {
          newConnectionId = newId.value;
        });

      onReconnecting(connectionId)
        .next()
        .then((attempt) => {
          attemptNumber = attempt.value;
        });

      expect(errors).toBeFalsy();
      expect(mockApi.open).toHaveBeenCalledTimes(1);

      const simulateDisconnect = (): void =>
        (mockApi.open.mock.calls[0] as any)[2]();

      jest.useFakeTimers();
      simulateDisconnect();
      expect(mockApi.open).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      await flushPromises();

      expect(mockApi.open).toHaveBeenCalledTimes(2);
      expect(attemptNumber).toBe(1);
      expect(newConnectionId).toBeTruthy();
      expect(connectionId).not.toEqual(newConnectionId);
      expect(getPort(newConnectionId)).toEqual("/dev/someotherport");

      simulateDisconnect();
      jest.advanceTimersByTime(1000);
      expect(mockApi.open).toHaveBeenCalledTimes(3);
    });

    it("should stop attempting to reconnect if the connection is lost", async () => {
      const { mutate } = createTestClient(apolloServer);

      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data, errors } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
              apiVersion
            }
          }
        `,
        variables: {
          port: "/dev/someotherport",
          baudRate: 99922,
        },
      });

      const connectionId = data?.connect.id;
      let newConnectionId: string = connectionId;

      onChanged(connectionId)
        .next()
        .then((newId) => {
          newConnectionId = newId.value;
        });

      expect(errors).toBeFalsy();
      expect(getPort(connectionId)).toEqual("/dev/someotherport");

      mockApi.open.mockRejectedValue(new Error("could not open"));

      const simulateDisconnect = (): void =>
        (mockApi.open.mock.calls[0] as any)[2]();

      const reconnectAttemptEvent = (): Promise<number> =>
        onReconnecting(connectionId)
          .next()
          .then(({ value }) => value);

      jest.useFakeTimers();
      // Wait for connection attempt events, and ensure
      // that the connection has been called correctly
      // for each one
      const testAttempts = (async () => {
        while (true) {
          const attempt = await reconnectAttemptEvent();
          jest.advanceTimersByTime(1000);
          if (attempt < 5) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(mockApi.open).toHaveBeenCalledTimes(attempt + 1);
          } else {
            await flushPromises();
            break;
          }
        }
      })();
      // After registering the function to listen for events
      // simulate the disconnect
      simulateDisconnect();
      await testAttempts;

      expect(mockApi.open).toHaveBeenCalledTimes(6);
      expect(isOpen(connectionId)).toBeFalsy();
      // The on change event should have been sent with undefined
      expect(newConnectionId).toBeUndefined();
    });

    it("should not reopen the connection if the device UID is not equal to the original", async () => {
      const { mutate } = createTestClient(apolloServer);

      mockApi.apiVersion.mockReturnValue("1.32.0");
      mockApi.readUID.mockResolvedValue("abcd");

      const { data, errors } = await mutate({
        mutation: gql`
          mutation Connect($port: String!, $baudRate: Int!) {
            connect(port: $port, baudRate: $baudRate) {
              id
              apiVersion
            }
          }
        `,
        variables: {
          port: "/dev/someotherport",
          baudRate: 99922,
        },
      });
      expect(errors).toBeFalsy();
      expect(getPort(data?.connect.id)).toEqual("/dev/someotherport");
      expect(mockApi.readUID).toHaveBeenCalledWith("/dev/someotherport");

      mockApi.readUID.mockResolvedValue("dcba");

      const simulateDisconnect = (): void =>
        (mockApi.open.mock.calls[0] as any)[2]();

      jest.useFakeTimers();
      simulateDisconnect();
      jest.advanceTimersByTime(1000);
      expect(mockApi.open).toHaveBeenCalledTimes(2);
      await flushPromises();
      expect(isOpen(data?.connect.id)).toBeFalsy();
    });
  });

  describe("close", () => {
    it("should close an open connection", async () => {
      const { mutate } = createTestClient(apolloServer);
      const connectionId = "abddddasdfsdf";
      let newConnectionId: string = connectionId;
      add("/dev/someport", connectionId);

      onChanged(connectionId)
        .next()
        .then((newId) => {
          newConnectionId = newId.value;
        });

      const { data, errors } = await mutate({
        mutation: gql`
          mutation CloseConnection($id: ID!) {
            close(connectionId: $id)
          }
        `,
        variables: {
          id: connectionId,
        },
      });

      expect(errors).toBeFalsy();
      expect(data?.close).toEqual(connectionId);
      expect(mockApi.close).toHaveBeenCalledWith("/dev/someport");
      expect(isOpen("/dev/someport")).toBeFalsy();
      expect(newConnectionId).toBeUndefined();
    });
  });
});
