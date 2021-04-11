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

type Options = { artifactsDir: string };
export const mockedContext = ({ artifactsDir }: Options) => (): Context => ({
  api: mockedApi,
  connections,
  jobs,
  port: "",
  artifactsDir,
});

export default ({ artifactsDir }: Options) => (): Context => ({
  api,
  connections,
  port: "",
  jobs,
  artifactsDir,
});
