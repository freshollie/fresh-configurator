import { ApolloError } from "apollo-server-express";
import gql from "graphql-tag";
import * as uuid from "uuid";
import fs from "fs";
import debug from "debug";
import { Resolvers } from "../../../__generated__";

const log = debug("api-server:blackbox");

const typeDefs = gql`
  type Mutation {
    createFlashDataOffloadJob(connectionId: ID!, chunkSize: Int!): JobDetails!
    eraseFlashData(connectionId: ID!): Boolean
  }

  type FlightController {
    blackbox: Blackbox!
  }

  type OffloadJobError {
    message: String!
  }

  type Blackbox {
    supported: Boolean!
    config: BlackboxConfig!
    flash: BlackboxFlash!
    sdCard: BlackboxSdCard!
  }

  type BlackboxConfig {
    device: Int!
    rateNum: Int!
    rateDenom: Int!
    pDenom: Int!
    sampleRate: Int!
  }

  type BlackboxFlash {
    ready: Boolean!
    supported: Boolean!
    sectors: Int!
    totalSize: Int!
    usedSize: Int!
  }

  type BlackboxSdCard {
    supported: Boolean!
    state: Int!
    filesystemLastError: Int!
    freeSizeKB: Int!
    totalSizeKB: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    blackbox: () => ({} as never),
  },
  Blackbox: {
    supported: (_, __, { api, port }) =>
      api.readBlackboxConfig(port).then(({ supported }) => supported),
    config: (_, __, { api, port }) => api.readBlackboxConfig(port),
    flash: (_, __, { api, port }) => api.readDataFlashSummary(port),
    sdCard: (_, __, { api, port }) => api.readSdCardSummary(port),
  },

  Mutation: {
    createFlashDataOffloadJob: async (
      _,
      { connectionId, chunkSize },
      { connections, jobs, api, offloadDir }
    ) => {
      const port = connections.getPort(connectionId);
      const { usedSize, ready } = await api.readDataFlashSummary(port);
      if (!ready) {
        throw new ApolloError("Flash data is not ready to be read");
      }

      const jobId = uuid.v4();

      await fs.promises
        .mkdir(offloadDir)
        .catch((e: { code?: string } & Error) => {
          if (e.code !== "EEXIST") {
            throw new ApolloError(
              `Could not create offload directory: ${e.message}`
            );
          }
        });

      const offloadFilePath = `${offloadDir}/${jobId}`;
      const offloadFile = await fs.promises.open(offloadFilePath, "w");
      log(
        `Created flash data offload job: ${jobId}. Expecting to read ${usedSize}`
      );

      jobs.add(jobId, "OFFLOAD_FLASH_DATA");

      (async () => {
        let address = 0;
        while (
          connections.isOpen(connectionId) &&
          address < usedSize &&
          !jobs.details(jobId)?.cancelled
        ) {
          log(`Reading chunk ${address}`);
          // eslint-disable-next-line no-await-in-loop
          const chunk = await api
            .readDataFlashChunk(port, address, chunkSize)
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            .catch((e) => {
              log(`Error reading chunk ${address}: ${e.message}`);
              return undefined;
            });

          if (chunk) {
            log(`Read chunk ${chunk.byteLength}`);
            // eslint-disable-next-line no-await-in-loop
            await offloadFile.write(chunk);
            address += chunk.byteLength;
            jobs.progress(jobId, address);
          }
        }

        const connectionClosed = !connections.isOpen(connectionId)
          ? new ApolloError("Connection closed to device")
          : undefined;
        const cancelled = jobs.details(jobId)?.cancelled;
        const errorClosing = await offloadFile.close().catch((e: Error) => {
          log(`Error closing file: ${e.message}`);
          return new ApolloError("Could not finish storing data offload");
        });

        const error = (errorClosing || connectionClosed) ?? cancelled;

        if (!error) {
          jobs.completed(jobId);
        } else {
          await fs.promises.unlink(offloadFilePath).catch((e) => {
            log(`Error removing file after error: ${e.message}`);
          });

          if (!cancelled) {
            jobs.completed(jobId, error as ApolloError);
          }
        }
      })();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return { id: jobId, ...jobs.details(jobId)! };
    },
  },
};

export default {
  resolvers,
  typeDefs,
};
