import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../src";
import { add, connectLock } from "../src/connections";
import { mockApi } from "./mocks";

const { apolloServer } = createServer();

describe("ports", () => {
  it("should return the available ports", async () => {
    mockApi.ports.mockResolvedValue([
      { path: "/dev/something" },
      { path: "/dev/anotherport" },
    ]);

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          ports {
            id
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.ports).toEqual([
      { id: "/dev/something" },
      { id: "/dev/anotherport" },
    ]);
    expect(mockApi.ports).toHaveBeenCalled();
  });

  it("should mark the port as connecting when connecting", async () => {
    mockApi.ports.mockResolvedValue([
      { path: "/dev/something" },
      { path: "/dev/anotherport" },
    ]);

    connectLock("/dev/anotherport", () => new Promise(() => {}));
    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          ports {
            id
            connecting
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.ports).toEqual([
      { id: "/dev/something", connecting: false },
      { id: "/dev/anotherport", connecting: true },
    ]);
    expect(mockApi.ports).toHaveBeenCalled();
  });

  it("should provide the connectionId if the port is connected", async () => {
    mockApi.ports.mockResolvedValue([
      { path: "/dev/something" },
      { path: "/dev/anotherport" },
    ]);

    add("/dev/something", "abcd");
    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          ports {
            id
            connectionId
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.ports).toEqual([
      { id: "/dev/something", connectionId: "abcd" },
      { id: "/dev/anotherport", connectionId: null },
    ]);
    expect(mockApi.ports).toHaveBeenCalled();
  });
});
