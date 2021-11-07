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
  transmitArtifactData: boolean;
};

type Options = { artifactsDir: string; transmitArtifactData?: boolean };
export const mockedContext =
  ({ artifactsDir, transmitArtifactData }: Options) =>
  (): Context => ({
    api: mockedApi,
    connections,
    jobs,
    port: "",
    artifacts: createArtifactsApi(artifactsDir),
    transmitArtifactData: transmitArtifactData ?? false,
  });

export default ({ artifactsDir, transmitArtifactData }: Options) =>
  (): Context => ({
    api,
    connections,
    port: "",
    jobs,
    artifacts: createArtifactsApi(artifactsDir),
    transmitArtifactData: transmitArtifactData ?? false,
  });
