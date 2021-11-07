import { BlackboxDevices, SdCardStates } from "@betaflight/api";
import gql from "graphql-tag";
import memfs from "memfs";
import mockDate from "mockdate";
import fs from "fs";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { JobType, JobUpdateType } from "../../src/graph/__generated__";
import { details, onUpdated, reset as resetJobs } from "../../src/jobs";
import { mockApi } from "../mocks";

const artifactsDirectory = "/artifacts";

const waitForJobProgress = async () => {
  const queue = onUpdated();
  while (true) {
    const update = await queue.next();
    if (!update.done) {
      const job = update.value;
      if (job.type === JobUpdateType.Changed && !job.details.completed) {
        return job.details;
      }
    }
  }
};

const waitForJobCompleted = async (jobId: string) => {
  const queue = onUpdated();
  while (true) {
    const update = await queue.next();
    if (!update.done) {
      const job = update.value;
      if (
        job.type === JobUpdateType.Changed &&
        job.details.completed &&
        job.details.id === jobId
      ) {
        return;
      }
    }
  }
};

const client = createExecutor({ artifactsDirectory });

afterEach(() => {
  reset();
  resetJobs();
});

describe("device.blackbox", () => {
  describe("supported", () => {
    it("should return the supported value", async () => {
      mockApi.readBlackboxConfig.mockResolvedValue({
        supported: true,
        device: BlackboxDevices.FLASH,
        rateNum: 1,
        rateDenom: 1,
        pDenom: 32,
        sampleRate: 0,
      });

      add("/dev/serial", "ajdfasdf");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "ajdfasdf") {
              device {
                blackbox {
                  supported
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.blackbox.supported).toBe(true);

      expect(mockApi.readBlackboxConfig).toHaveBeenCalledWith("/dev/serial");
    });
  });

  describe("config", () => {
    it("should return the config values", async () => {
      mockApi.readBlackboxConfig.mockResolvedValue({
        supported: true,
        device: BlackboxDevices.FLASH,
        rateNum: 1,
        rateDenom: 1,
        pDenom: 32,
        sampleRate: 0,
      });

      add("/dev/serial", "jhadkjhadf");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "jhadkjhadf") {
              device {
                blackbox {
                  config {
                    device
                    rateNum
                    rateDenom
                    pDenom
                    sampleRate
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.blackbox.config).toEqual({
        device: BlackboxDevices.FLASH,
        rateNum: 1,
        rateDenom: 1,
        pDenom: 32,
        sampleRate: 0,
      });

      expect(mockApi.readBlackboxConfig).toHaveBeenCalledWith("/dev/serial");
    });
  });

  describe("flash", () => {
    it("should return the flash summary", async () => {
      mockApi.readDataFlashSummary.mockResolvedValue({
        ready: true,
        supported: true,
        sectors: 42,
        totalSize: 1234,
        usedSize: 5678,
      });

      add("/dev/serial", "jhadkjhadf");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "jhadkjhadf") {
              device {
                blackbox {
                  flash {
                    ready
                    supported
                    sectors
                    totalSize
                    usedSize
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.blackbox.flash).toEqual({
        ready: true,
        supported: true,
        sectors: 42,
        totalSize: 1234,
        usedSize: 5678,
      });

      expect(mockApi.readDataFlashSummary).toHaveBeenCalledWith("/dev/serial");
    });
  });

  describe("sdCard", () => {
    it("should return the blackbox sdcard summary", async () => {
      mockApi.readSdCardSummary.mockResolvedValue({
        supported: true,
        state: SdCardStates.FS_INIT,
        filesystemLastError: 1,
        freeSizeKB: 9876,
        totalSizeKB: 6543,
      });

      add("/dev/serial", "jhadkjhadf");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "jhadkjhadf") {
              device {
                blackbox {
                  sdCard {
                    supported
                    state
                    filesystemLastError
                    freeSizeKB
                    totalSizeKB
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.blackbox.sdCard).toEqual({
        supported: true,
        state: SdCardStates.FS_INIT,
        filesystemLastError: 1,
        freeSizeKB: 9876,
        totalSizeKB: 6543,
      });

      expect(mockApi.readSdCardSummary).toHaveBeenCalledWith("/dev/serial");
    });
  });

  describe("deviceSetBlackboxConfig", () => {
    it("should update the blackbox config with the provided values", async () => {
      mockApi.writePartialBlackboxConfig.mockResolvedValue();
      add("/dev/serial", "fsu9dfgjkhdsfgk");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetDeviceConfig($config: BlackboxConfigInput!) {
            deviceSetBlackboxConfig(
              connectionId: "fsu9dfgjkhdsfgk"
              config: $config
            )
          }
        `,
        variables: {
          config: {
            device: BlackboxDevices.SERIAL,
            sampleRate: 100,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialBlackboxConfig).toHaveBeenCalledWith(
        "/dev/serial",
        {
          device: BlackboxDevices.SERIAL,
          sampleRate: 100,
        }
      );
    });
  });

  describe("deviceEraseFlashData", () => {
    it("should erase the device flash data", async () => {
      mockApi.eraseDataFlash.mockResolvedValue();
      add("/dev/serial", "lkajsdflksdf");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation {
            deviceEraseFlashData(connectionId: "lkajsdflksdf")
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(mockApi.eraseDataFlash).toHaveBeenCalledWith("/dev/serial");
    });
  });

  describe("createFlashDataOffloadJob", () => {
    beforeEach(() => {
      memfs.vol.reset();
      mockDate.set(new Date("2021-03-14T14:00:00Z"));
      mockApi.readName.mockResolvedValue("some-device");
      mockApi.readFcVariant.mockResolvedValue("BTFL");
      mockApi.readDataFlashSummary.mockResolvedValue({
        ready: true,
        supported: true,
        sectors: 42,
        totalSize: 8192,
        usedSize: 4096,
      });
      mockApi.isOpen.mockReturnValue(true);
    });

    it("should offload the flash data into an artifact file", async () => {
      let callNum = 0;
      mockApi.readDataFlashChunk.mockImplementation(async () => {
        callNum += 1;
        if (callNum === 3) {
          throw new Error("make sure we can handle failures");
        }
        return Buffer.from(new Array(512).fill(1));
      });

      add("/dev/thedevice", "fsu9dfgjkhdsfgk");

      const jobProgress = jest.fn();
      waitForJobProgress().then(jobProgress);

      const { errors, data } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "fsu9dfgjkhdsfgk"
              chunkSize: 512
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      const jobId = data?.createFlashDataOffloadJob.id;

      await waitForJobCompleted(jobId);

      const job = details(jobId);
      expect(job).toEqual({
        artifact: expect.any(String),
        cancelled: false,
        completed: true,
        connectionId: "fsu9dfgjkhdsfgk",
        createdAt: "2021-03-14T14:00:00.000Z",
        progress: 4096,
        type: JobType.Offload,
      });
      expect(jobProgress).toHaveBeenCalledWith({
        cancelled: false,
        completed: false,
        connectionId: "fsu9dfgjkhdsfgk",
        createdAt: "2021-03-14T14:00:00.000Z",
        progress: 512,
        id: jobId,
        type: JobType.Offload,
      });

      // This functions should have been called for each chunk
      new Array(8).fill(1).forEach((_, i) => {
        expect(mockApi.readDataFlashChunk).toHaveBeenCalledWith(
          "/dev/thedevice",
          i * 512,
          512
        );
      });
      // 1 of the calls failed, so expected 5
      expect(mockApi.readDataFlashChunk).toHaveBeenCalledTimes(9);

      expect(mockApi.readName).toHaveBeenCalledWith("/dev/thedevice");
      expect(mockApi.readFcVariant).toHaveBeenCalledWith("/dev/thedevice");
      expect(mockApi.readDataFlashSummary).toHaveBeenCalledWith(
        "/dev/thedevice"
      );
      expect(mockApi.isOpen).toHaveBeenCalledWith("/dev/thedevice");

      expect(
        await fs.promises.readFile(`${artifactsDirectory}/${job?.artifact}`)
      ).toEqual(Buffer.from(new Array(4096).fill(1)));
    });

    it("should stop reading once 0 bytes are read", async () => {
      let callNum = 0;
      mockApi.readDataFlashChunk.mockImplementation(async () => {
        callNum += 1;
        if (callNum > 1) {
          return Buffer.from([]);
        }
        return Buffer.from(new Array(512).fill(1));
      });

      add("/dev/thedevice", "fsu9dfgjkhdsfgk");

      const { errors, data } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "fsu9dfgjkhdsfgk"
              chunkSize: 4096
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      const jobId = data?.createFlashDataOffloadJob.id;

      await waitForJobCompleted(jobId);

      const job = details(jobId);
      expect(job).toEqual({
        artifact: expect.any(String),
        cancelled: false,
        completed: true,
        connectionId: "fsu9dfgjkhdsfgk",
        createdAt: "2021-03-14T14:00:00.000Z",
        progress: 512,
        type: JobType.Offload,
      });

      // This functions should have been called for each chunk
      expect(mockApi.readDataFlashChunk).toHaveBeenCalledWith(
        "/dev/thedevice",
        0,
        4096
      );
      // 1 of the calls failed, so expected 5
      expect(mockApi.readDataFlashChunk).toHaveBeenCalledTimes(2);

      expect(
        await fs.promises.readFile(`${artifactsDirectory}/${job?.artifact}`)
      ).toEqual(Buffer.from(new Array(512).fill(1)));
    });

    it("should mark the job as errored if device disconnects", async () => {
      mockApi.readDataFlashChunk.mockResolvedValue(
        Buffer.from(new Array(512).fill(1))
      );

      // pretend that device disconencted
      mockApi.isOpen.mockReturnValue(false);

      add("/dev/thedevice", "oijlkjsfgsdf");
      const { errors, data } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "oijlkjsfgsdf"
              chunkSize: 512
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      const jobId = data?.createFlashDataOffloadJob.id;

      await waitForJobCompleted(jobId);

      const job = details(jobId);
      expect(job).toEqual({
        cancelled: false,
        completed: true,
        error: {
          message: "Connection closed to device",
        },
        connectionId: "oijlkjsfgsdf",
        createdAt: "2021-03-14T14:00:00.000Z",
        progress: 0,
        type: JobType.Offload,
      });

      expect(await fs.promises.readdir(artifactsDirectory)).toEqual([]);
    });

    it("should stop reading chunks if job is cancelled", async () => {
      let resolveChunk: ((value: Buffer) => void) | undefined;
      mockApi.readDataFlashChunk.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveChunk = resolve;
          })
      );

      add("/dev/thedevice", "lasdhfjahsdf");
      const { errors, data } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "lasdhfjahsdf"
              chunkSize: 512
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      const jobId = data?.createFlashDataOffloadJob.id;

      const { errors: cancelErrors } = await client.mutate({
        mutation: gql`
          mutation CancelJob($jobId: ID!) {
            cancelJob(jobId: $jobId)
          }
        `,
        variables: {
          jobId,
        },
      });

      expect(cancelErrors).toBeFalsy();

      resolveChunk?.(Buffer.from([1, 2, 3]));

      await waitForJobCompleted(jobId);

      const job = details(jobId);
      expect(job).toEqual({
        cancelled: true,
        completed: true,
        connectionId: "lasdhfjahsdf",
        createdAt: "2021-03-14T14:00:00.000Z",
        progress: 0,
        type: JobType.Offload,
      });

      expect(mockApi.readDataFlashChunk).toHaveBeenCalledTimes(1);
      expect(await fs.promises.readdir(artifactsDirectory)).toEqual([]);
    });

    it("should throw an error if flash is not ready to be read", async () => {
      mockApi.readDataFlashSummary.mockResolvedValue({
        ready: false,
        supported: true,
        sectors: 42,
        totalSize: 8192,
        usedSize: 4096,
      });

      add("/dev/thedevice", "asjdhfkjha");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "asjdhfkjha"
              chunkSize: 512
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toMatchInlineSnapshot(`
        Array [
          [GraphQLError: Flash data is not ready to be read],
        ]
      `);
    });

    it("should throw an error if artifacts directory cannot be created", async () => {
      await fs.promises.writeFile(artifactsDirectory, "sometext");

      add("/dev/thedevice", "asjdhfkjha");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation CreateOffloadJob {
            createFlashDataOffloadJob(
              connectionId: "asjdhfkjha"
              chunkSize: 512
            ) {
              id
            }
          }
        `,
      });

      expect(errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Could not create artifacts directory: ENOTDIR: not a directory, mkdir '/artifacts'],
]
`);
    });
  });
});
