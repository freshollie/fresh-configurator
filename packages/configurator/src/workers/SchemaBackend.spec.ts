/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-return-assign */
import "./SchemaBackend.worker";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { initialiseSerialBackend } from "@betaflight/api";
import WSABinding from "serialport-binding-webserialapi";
import { MessageBusLink } from "../shared/apollo-messagebus-link";
import { SchemaBackendInitArgs } from "../shared/types";

jest.mock("@betaflight/api");

const link = new MessageBusLink<SchemaBackendInitArgs>({
  registerResponseHandler: (handler) => {
    self.postMessage = (event) => {
      handler(event);
    };
  },
  requestHandler: (message) => {
    self.onmessage?.({ data: message } as MessageEvent);
  },
});

describe("SchemaBackendWorker", () => {
  it("should setup a schema executor when init message is sent", async () => {
    await link.initialiseBackend({ mocked: false });
  });

  it("should initialise the web serial backend for betaflight api", async () => {
    await link.initialiseBackend({ mocked: false });
    expect(initialiseSerialBackend).toHaveBeenCalledWith(WSABinding);
  });

  it("should execute apollo queries", async () => {
    await link.initialiseBackend({ mocked: true });

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query({
      query: gql`
        query {
          ports {
            id
          }
        }
      `,
    });
    expect(data.ports.length).toBeGreaterThan(0);
  });
});
