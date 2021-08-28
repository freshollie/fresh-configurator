import mockFs from "mock-fs";
import supertest from "supertest";
import { createServer } from "../src";

describe("/job-artifacts", () => {
  const artifactsDirectory = "someartifactsdirectory";
  beforeEach(() => {
    mockFs({
      someartifactsdirectory: {
        "89765": Buffer.from([0, 1, 2, 3]),
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should provide access to the configured artifacts directory", async () => {
    const { rest } = createServer({ artifactsDirectory });

    const response = await supertest(rest).get("/job-artifacts/89765");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(Buffer.from([0, 1, 2, 3]));
  });

  it("should respond with 404 for non existent artifacts", async () => {
    const { rest } = createServer({ artifactsDirectory });

    const response = await supertest(rest).get("/job-artifacts/43532");

    expect(response.status).toBe(404);
  });
});
