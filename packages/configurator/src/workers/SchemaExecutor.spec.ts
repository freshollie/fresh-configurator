/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-return-assign */
import "./SchemaExecutor.worker";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { initialiseSerialBackend } from "@betaflight/api";
import WSABinding from "serialport-binding-webserialapi";
import MessengerLink from "../renderer/gql/links/MessengerLink";

jest.mock("@betaflight/api");

describe("SchemaExecutor", () => {
  it("should setup a schema executor when init message is sent", async () => {
    const response = new Promise((resolve) => (self.postMessage = resolve));
    self.onmessage?.({ data: { type: "init", mocked: false } } as MessageEvent);
    await expect(response).resolves.toEqual(expect.anything());
  });

  it("should initialise the web serial backend for betaflight api", async () => {
    self.onmessage?.({ data: { type: "init", mocked: false } } as MessageEvent);
    expect(initialiseSerialBackend).toHaveBeenCalledWith(WSABinding);
  });

  it("should execute apollo queries", async () => {
    const response = new Promise((resolve) => (self.postMessage = resolve));
    self.onmessage?.({ data: { type: "init", mocked: true } } as MessageEvent);
    await expect(response).resolves.toEqual(expect.anything());
    class WebWorkerMockLink extends MessengerLink {
      constructor() {
        super((message) => {
          self.onmessage?.({ data: message } as MessageEvent);
        });

        // eslint-disable-next-line no-param-reassign
        self.postMessage = (event) => this.listener(event);
      }
    }

    const client = new ApolloClient({
      link: new WebWorkerMockLink(),
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
