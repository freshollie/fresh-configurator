import { ApolloError } from "apollo-server-express";

import gql from "graphql-tag";
import {
  JobUpdate,
  RequireFields,
  Resolvers,
  SubscriptionJobUpdatesArgs,
} from "../__generated__";
import { Context } from "../../context";
import { withFilter } from "graphql-subscriptions";

const typeDefs = gql`
  type Mutation {
    cancelJob(jobId: ID!): Boolean
  }

  type Query {
    jobs(ofType: JobType): [JobDetails!]!
    job(id: ID!): JobDetails
  }

  type Subscription {
    jobUpdates(jobId: ID, ofType: JobType): JobUpdate!
  }

  enum JobUpdateType {
    NEW
    CHANGED
    REMOVED
  }

  enum JobType {
    OFFLOAD
    GENERAL
  }

  type JobUpdate {
    type: JobUpdateType!
    details: JobDetails!
  }

  type JobDetails {
    id: String!
    createdAt: String!
    progress: Int!
    error: JobError
    completed: Boolean!
    cancelled: Boolean!
    artifact: String
    type: JobType!
    connectionId: String
  }

  type JobError {
    message: String!
    code: Int
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    cancelJob: (_, { jobId }, { jobs }) => {
      if (!jobs.details(jobId)) {
        throw new ApolloError("Job does not exist");
      }

      jobs.cancel(jobId);
      return null;
    },
  },
  Subscription: {
    jobUpdates: {
      subscribe: withFilter(
        (_, __, { jobs }: Context): AsyncIterator<JobUpdate> =>
          jobs.onUpdated(),
        (
          payload: JobUpdate,
          variables: RequireFields<SubscriptionJobUpdatesArgs, never>
        ) =>
          (variables.jobId ? variables.jobId === payload.details.id : true) &&
          (variables.ofType ? variables.ofType === payload.details.type : true)
      ),
      resolve: (update: JobUpdate) => update,
    },
  },
  Query: {
    job: (_, { id }, { jobs }) => {
      const details = jobs.details(id);
      return details ? { id, ...details } : null;
    },
    jobs: (_, { ofType }, { jobs }) =>
      jobs.all().filter((job) => (ofType ? job.type === ofType : true)),
  },
};

export default {
  typeDefs,
  resolvers,
};
