import { PubSub } from "graphql-subscriptions";
import debug from "debug";
import type { JobType, JobUpdateType } from "./graph/__generated__";

const log = debug("api-graph:jobs");

export type JobError = {
  message: string;
};

type JobDetails = {
  type: JobType;
  connectionId?: string;
  completed: boolean;
  error?: JobError;
  progress: number;
  cancelled: boolean;
  artifact?: {
    id: string;
    // Unused, will be filled by resolvers
    data: string;
  };
  createdAt: string;
};

type JobUpdate = {
  type: JobUpdateType;
  details: JobDetails & { id: string };
};

const updatedEvents = new PubSub();

const jobs: Record<string, JobDetails> = {};

export const reset = (): void => {
  Object.keys(jobs).forEach((key) => {
    delete jobs[key];
  });
};

export const add = (
  jobId: string,
  type: JobType,
  connectionId?: string
): void => {
  const newJob = {
    type,
    completed: false,
    cancelled: false,
    progress: 0,
    createdAt: new Date().toISOString(),
    connectionId,
  };
  jobs[jobId] = newJob;
  updatedEvents.publish("updated", {
    type: "NEW",
    details: {
      id: jobId,
      ...newJob,
    },
  } as JobUpdate);
};

export const details = (jobId: string): JobDetails | undefined => jobs[jobId];

export const all = (): ({ id: string } & JobDetails)[] =>
  Object.entries(jobs).map(([id, jobDetails]) => ({ id, ...jobDetails }));

export const progress = (jobId: string, progressValue: number): void => {
  const jobDetails = details(jobId);
  if (jobDetails && !jobDetails.cancelled) {
    const updatedDetails = {
      ...jobDetails,
      progress: progressValue,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish("updated", {
      type: "CHANGED",
      details: {
        id: jobId,
        ...updatedDetails,
      },
    } as JobUpdate);
  }
};

export const completed = (
  jobId: string,
  params?: { error?: JobError; artifact?: string }
): void => {
  const jobDetails = details(jobId);
  if (jobDetails && !jobDetails.completed) {
    log("Job completed", jobId);
    const updatedDetails = {
      ...jobDetails,
      completed: true,
      ...params,
      artifact: params?.artifact
        ? // Filled by resolvers
          { id: params.artifact, data: "" }
        : undefined,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish("updated", {
      type: "CHANGED",
      details: {
        id: jobId,
        ...updatedDetails,
      },
    } as JobUpdate);
  }
};

export const cancel = (jobId: string): void => {
  const jobDetails = details(jobId);
  if (jobDetails && !jobDetails.completed) {
    const updatedDetails = {
      ...jobDetails,
      cancelled: true,
      completed: false,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish("updated", {
      type: "CHANGED",
      details: {
        id: jobId,
        ...updatedDetails,
      },
    } as JobUpdate);
  }
};

export const onUpdated = (): AsyncIterator<JobUpdate> =>
  updatedEvents.asyncIterator("updated");
