import gql from "graphql-tag";
import * as jobs from "../src/jobs";
import { createExecutor } from "./utils";
import { JobType } from "../src/graph/__generated__";

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

    const client = createExecutor();
    await client.context.artifacts.writeArtifact("test.png", "my data");

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
            artifact {
              id
              data
            }
            connectionId
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.jobs).toEqual([
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
        artifact: {
          id: "test.png",
          data: Buffer.from("my data").toString("base64"),
        },
        createdAt: expect.any(String),
        connectionId: null,
      },
    ]);

    expect(
      data?.jobs[0]!.createdAt.startsWith(
        new Date().toISOString().split("T")[0]!
      )
    ).toBeTruthy();
  });

  it("should allow jobs to be filtered by type", async () => {
    jobs.add("abc", JobType.Offload);
    jobs.add("bcd", JobType.General);

    const client = createExecutor();
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
            artifact {
              id
              data
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.jobs).toEqual([
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

      const client = createExecutor();
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
      expect(data?.jobs).toEqual([
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
});
