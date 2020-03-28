import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  ports,
  isOpen,
  open,
  getAttitude,
  close,
  initialise,
  apiVersion,
  bytesRead,
  bytesWritten,
  packetErrors,
  getStatusExtended,
  getRcValues
} from "@fresh/msp";
import semver from "semver";
import {
  Resolvers,
  ConnectionStateQueryVariables,
  ConnectionStateDocument,
  ConnectionStateQuery,
  LogsQuery,
  LogsQueryVariables,
  LogsDocument
} from "./__generated__";
import config from "../config";
import { versionInfo } from "../util";

interface Context {
  client: ApolloClient<object>;
}

const cache = new InMemoryCache();

const selectedPort = cache.makeVar<string | null>(null);
// default baudrate
const selectedBaud = cache.makeVar<number>(115200);

const expertMode = cache.makeVar<boolean>(false);
const selectedTab = cache.makeVar<string | null>(null);

cache.policies.addTypePolicies({
  Configurator: {
    fields: {
      port: () => selectedPort(),
      baudRate: () => selectedBaud(),
      tab: () => selectedTab(),
      expertMode: () => expertMode()
    }
  }
});

const setConnectionState = (
  client: ApolloClient<object>,
  port: string,
  connecting: boolean,
  connected: boolean
): void =>
  client.writeQuery<ConnectionStateQuery, ConnectionStateQueryVariables>({
    query: ConnectionStateDocument,
    data: {
      __typename: "Query",
      device: {
        connection: {
          connected,
          connecting,
          __typename: "ConnectionStatus"
        },
        __typename: "FlightController"
      }
    },
    variables: {
      port
    }
  });

const log = (client: ApolloClient<object>, message: string): void => {
  const data = client.readQuery<LogsQuery, LogsQueryVariables>({
    query: LogsDocument
  });

  client.writeQuery<LogsQuery, LogsQueryVariables>({
    query: LogsDocument,
    data: {
      configurator: {
        logs: [
          ...(data?.configurator.logs ?? []).concat({
            time: new Date().toISOString(),
            message,
            __typename: "Log" as const
          })
        ],
        __typename: "Configurator"
      },
      __typename: "Query"
    }
  });
};

const resolvers: Resolvers = {
  Query: {
    ports: () => ports(),
    device: (_, { port }) => ({
      port,
      apiVersion: "",
      connection: {
        port,
        connecting: false,
        connected: false,
        __typename: "ConnectionStatus"
      },
      __typename: "FlightController"
    }),
    configurator: () => {
      const { os, version, chromeVersion } = versionInfo();
      return {
        port: selectedPort(),
        baudRate: selectedBaud(),
        tab: selectedTab(),
        expertMode: expertMode(),
        logs: [
          {
            time: new Date().toISOString(),
            message: `Running - OS: <strong>${os}</strong>, Chrome: <strong>${chromeVersion}</strong>, Configurator: <strong>${version}</strong>`,
            __typename: "Log"
          }
        ],
        __typename: "Configurator"
      };
    }
  },
  Mutation: {
    connect: async (_, { port, baudRate }, { client }: Context) => {
      if (isOpen(port)) {
        return true;
      }

      let closed = false;

      setConnectionState(client, port, true, false);

      await open(port, { baudRate }, () => {
        // on disconnect
        log(
          client,
          `Serial port <span class="message-positive">successfully</span> closed on ${port}`
        );
        setConnectionState(client, port, false, false);
        closed = true;
      });
      log(
        client,
        `Serial port <span class="message-positive">successfully</span> opened on ${port}`
      );

      try {
        await initialise(port);
        const version = apiVersion(port);
        log(client, `MultiWii API version: <strong>${version}</strong>`);

        if (semver.gte(version, config.apiVersionAccepted)) {
          setConnectionState(client, port, false, true);
          return true;
        }
        log(
          client,
          `MSP version not supported: <span class="message-negative">${version}</span>`
        );
      } catch (e) {
        console.log(e);
        log(
          client,
          `No configuration received within <span class="message-negative">5 seconds</span>, communication <span class="message-negative">failed</span>`
        );
      }

      // And only close the port if we are connecting
      if (!closed) {
        await close(port);
      }

      return false;
    },
    disconnect: async (_, { port }, { client }: Context) => {
      if (!isOpen(port)) {
        return true;
      }

      await close(port);
      setConnectionState(client, port, false, false);

      return true;
    },

    setTab: (_, { tabId }) => !!selectedTab(tabId),
    setConnectionSettings: (_, { port, baudRate }) => {
      selectedPort(port);
      if (typeof baudRate === "number") {
        selectedBaud(baudRate);
      }
      return true;
    },
    setExpertMode: (_, { enabled }) => !!expertMode(enabled),
    log: (_, { message }, { client }: Context) => {
      log(client, message);
      return true;
    }
  },

  FlightController: {
    attitude: ({ port }) =>
      getAttitude(port).then(values => ({ ...values, __typename: "Attitude" })),
    status: ({ port }) =>
      getStatusExtended(port).then(values => ({
        ...values,
        __typename: "Status"
      })),
    rc: ({ port }) => ({
      port,
      __typename: "RC"
    }),
    apiVersion: ({ port }) => apiVersion(port)
  },
  ConnectionStatus: {
    bytesRead: ({ port }) => bytesRead(port),
    bytesWritten: ({ port }) => bytesWritten(port),
    packetErrors: ({ port }) => packetErrors(port)
  },
  RC: {
    channels: ({ port }) => getRcValues(port)
  }
};

const client = new ApolloClient({
  cache,
  // generated resolvers are not compatible with apollo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: resolvers as any
});

export default client;
