import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { mockApi } from "./mocks";
import server from "../src";
import { reset } from "../src/connections";

afterEach(() => {
  reset();
});

describe("connections", () => {
  describe("connect", () => {
    it("should initialise a connection on the given port with given baudrate", async () => {
      const { mutate } = createTestClient(server);

      mockApi.apiVersion.mockReturnValue("1.32.0");

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
    });

    it("should return a unique connection id for every connection", async () => {
      const { mutate } = createTestClient(server);
      mockApi.apiVersion.mockReturnValue("1.32.0");

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
  });
});
