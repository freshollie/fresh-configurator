import * as api from "@betaflight/api";
import * as mockedApi from "./mock/api";
import * as connections from "./connections";
import * as jobs from "./jobs";
import { ArtifactsApi, createArtifactsApi } from "./artifacts";

export type Context = {
  api: typeof api;
  connections: typeof connections;
  jobs: typeof jobs;
  port: string;
  artifacts: ArtifactsApi;
};

type ContextFunc = () => Context;

type Options = { artifactsDir: string };
export const mockedContext = ({ artifactsDir }: Options): ContextFunc => {
  const artifacts = createArtifactsApi(artifactsDir);
  return () => ({
    api: mockedApi,
    connections,
    jobs,
    port: "",
    artifacts,
  });
};

export default ({ artifactsDir }: Options): ContextFunc => {
  const artifacts = createArtifactsApi(artifactsDir);
  return () => ({
    api,
    connections,
    port: "",
    jobs,
    artifacts,
  });
};
