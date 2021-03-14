import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import mockFs from "mock-fs";
import supertest from "supertest";
import * as jobs from "../src/jobs";
import { createServer } from "../src";
import { JobType } from "../src/graph/__generated__";

const { apolloServer } = createServer();

afterEach(() => {
  jobs.reset();
});

describe("jobs", () => {
  it("should return the list of jobs", async () => {
    jobs.add("abc", JobType.Offload, "someconnection");
    jobs.add("bcd", JobType.Offload);
    jobs.progress("abc", 100);
    jobs.completed("abc", { error: { message: "test" } });
    jobs.completed("bcd", { artifact: "test.png" });

    const client = createTestClient(apolloServer);
    const { data, errors } = await client.query({
      query: gql`
        query {
          jobs {
            id
            cancelled
            completed
            error {
              message
              code
            }
            type
            progress
            createdAt
            artifact
            connectionId
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data.jobs).toEqual([
      {
        id: "abc",
        progress: 100,
        cancelled: false,
        completed: true,
        error: {
          message: "test",
          code: null,
        },
        type: JobType.Offload,
        artifact: null,
        createdAt: expect.any(String),
        connectionId: "someconnection",
      },
      {
        id: "bcd",
        progress: 0,
        cancelled: false,
        completed: true,
        error: null,
        type: JobType.Offload,
        artifact: "test.png",
        createdAt: expect.any(String),
        connectionId: null,
      },
    ]);

    expect(
      data.jobs[0]!.createdAt.startsWith(
        new Date().toISOString().split("T")[0]!
      )
    ).toBeTruthy();
  });

  it("should allow jobs to be filtered by type", async () => {
    jobs.add("abc", JobType.Offload);
    jobs.add("bcd", JobType.General);

    const client = createTestClient(apolloServer);
    const { data, errors } = await client.query({
      query: gql`
        query {
          jobs(ofType: GENERAL) {
            id
            cancelled
            completed
            error {
              message
              code
            }
            type
            progress
            createdAt
            artifact
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data.jobs).toEqual([
      {
        id: "bcd",
        progress: 0,
        cancelled: false,
        completed: false,
        error: null,
        type: JobType.General,
        artifact: null,
        createdAt: expect.any(String),
      },
    ]);
  });

  describe("cancelJob", () => {
    it("should cancel the given job id", async () => {
      jobs.add("bcd", JobType.Offload);

      const client = createTestClient(apolloServer);
      const { errors } = await client.mutate({
        mutation: gql`
          mutation {
            cancelJob(jobId: "bcd")
          }
        `,
      });

      expect(errors).toBeFalsy();

      const { data } = await client.query({
        query: gql`
          query {
            jobs {
              id
              cancelled
              completed
              error {
                message
                code
              }
              type
              progress
            }
          }
        `,
      });
      expect(data.jobs).toEqual([
        {
          id: "bcd",
          progress: 0,
          cancelled: true,
          // the processor of the job should mark the job as cancelled
          completed: false,
          error: null,
          type: JobType.Offload,
        },
      ]);
    });
  });

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
});
