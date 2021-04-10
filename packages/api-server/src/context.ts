import * as api from "@betaflight/api";
import * as mockedApi from "./mock/api";
import * as connections from "./connections";
import * as jobs from "./jobs";

export type Context = {
  api: typeof api;
  connections: typeof connections;
  jobs: typeof jobs;
  port: string;
  artifactsDir: string;
};

export const mockedContext = (): Context => ({
  api: mockedApi,
  connections,
  jobs,
  port: "",
  artifactsDir: `${__dirname}/artifacts`,
});

export default ({ artifactsDir }: { artifactsDir: string }) => (): Context => ({
  api,
  connections,
  port: "",
  jobs,
  artifactsDir,
});
