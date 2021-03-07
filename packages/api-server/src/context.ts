import * as api from "@betaflight/api";
import * as mockedApi from "./mock/api";
import * as connections from "./connections";
import * as jobs from "./jobs";
import * as mockedConnections from "./mock/connections";

export type Context = {
  api: typeof api;
  connections: typeof connections;
  jobs: typeof jobs;
  port: string;
  offloadDir: string;
};

export const mockedContext = (): Context => ({
  api: mockedApi,
  connections: mockedConnections,
  jobs,
  port: "",
  offloadDir: `${__dirname}/offloaded`,
});

export default ({ offloadDir }: { offloadDir: string }) => (): Context => ({
  api,
  connections,
  port: "",
  jobs,
  offloadDir,
});
