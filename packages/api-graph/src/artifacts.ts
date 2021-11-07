import fs from "fs";
import { GraphQLError } from "graphql";

const { readFile, writeFile, open, unlink, mkdir } = fs.promises;

export type ArtifactsApi = {
  readArtifact(id: string, encoding?: BufferEncoding): Promise<string>;
  writeArtifact(id: string, data: string): Promise<void>;
  open(id: string, mode: "w" | "r"): Promise<fs.promises.FileHandle>;
  delete(id: string): Promise<void>;
};

export const createArtifactsApi = (artifactsDir: string): ArtifactsApi => {
  const toPath = (id: string): string => `${artifactsDir}/${id}`;

  const ensureDirectory = async (): Promise<void> => {
    await mkdir(artifactsDir, { recursive: true }).catch(
      (e: { code?: string } & Error) => {
        if (e.code !== "EEXIST") {
          throw new GraphQLError(
            `Could not create artifacts directory: ${e.message}`
          );
        }
      }
    );
  };

  return {
    readArtifact: async (id, encoding) =>
      (await readFile(toPath(id))).toString(encoding),
    writeArtifact: async (id, data) => {
      await ensureDirectory();
      await writeFile(toPath(id), data);
    },
    open: async (id, mode) => {
      await ensureDirectory();
      return open(toPath(id), mode);
    },
    delete: (id) => unlink(toPath(id)),
  };
};
