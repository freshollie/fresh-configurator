import { ApolloError, PubSub } from "apollo-server-express";

type JobDetails = {
  type: string;
  completed: boolean;
  error?: ApolloError;
  progress: number;
  cancelled: boolean;
};
export type JobDetailsWithId = JobDetails & { id: string };
const updatedEvents = new PubSub();

const jobs: Record<string, JobDetails> = {};

export const reset = (): void => {
  Object.keys(jobs).forEach((key) => {
    delete jobs[key];
  });
};

export const add = (jobId: string, type: string): void => {
  const newJob = {
    type,
    completed: false,
    cancelled: false,
    progress: 0,
  };
  jobs[jobId] = newJob;
  updatedEvents.publish("updated", {
    id: jobId,
    ...newJob,
  } as JobDetailsWithId);
};

export const details = (jobId: string): JobDetails | undefined => jobs[jobId];

export const all = (): ({ id: string } & JobDetails)[] =>
  Object.entries(jobs).map(([id, jobDetails]) => ({ id, ...jobDetails }));

export const progress = (jobId: string, progressValue: number): void => {
  const jobDetails = details(jobId);
  if (jobDetails) {
    const updatedDetails = {
      ...jobDetails,
      progress: progressValue,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish(jobId, {
      id: jobId,
      ...updatedDetails,
    } as JobDetailsWithId);
  }
};

export const completed = (jobId: string, error?: ApolloError): void => {
  const jobDetails = details(jobId);
  if (jobDetails && !jobDetails.completed) {
    const updatedDetails = {
      ...jobDetails,
      completed: true,
      error,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish("updated", {
      id: jobId,
      ...updatedDetails,
    } as JobDetailsWithId);
  }
};

export const cancel = (jobId: string): void => {
  const jobDetails = details(jobId);
  if (jobDetails && !jobDetails.completed) {
    const updatedDetails = {
      ...jobDetails,
      cancelled: true,
    };
    jobs[jobId] = updatedDetails;
    updatedEvents.publish("updated", {
      id: jobId,
      ...updatedDetails,
    } as JobDetailsWithId);
  }
};

export const onUpdated = (): AsyncIterator<JobDetailsWithId> =>
  updatedEvents.asyncIterator("updated");
