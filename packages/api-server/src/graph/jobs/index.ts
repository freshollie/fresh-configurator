import { ApolloError, withFilter } from "apollo-server-express";
import gql from "graphql-tag";
import {
  RequireFields,
  Resolvers,
  SubscriptionJobUpdatesArgs,
} from "../__generated__";
import { Context } from "../../context";
import { JobDetailsWithId } from "../../jobs";

const typeDefs = gql`
  type Mutation {
    cancelJob(jobId: ID!): Boolean
  }

  type Query {
    jobs(ofType: String): [JobDetails!]!
    job(id: ID!): JobDetails
  }

  type Subscription {
    jobUpdates(jobId: ID): JobDetails!
  }

  type JobDetails {
    id: String!
    progress: Int!
    error: JobError
    completed: Boolean!
    cancelled: Boolean!
  }

  type JobError {
    message: String!
    code: Int
  }
`;

const resolvers: Resolvers = {
  Mutation: {
    cancelJob: (_, { jobId }, { jobs }) => {
      if (jobs.details(jobId)) {
        throw new ApolloError("Job does not exist");
      }

      jobs.cancel(jobId);
      return null;
    },
  },
  Subscription: {
    jobUpdates: {
      subscribe: withFilter(
        (_, __, { jobs }: Context) => jobs.onUpdated(),
        (
          payload: JobDetailsWithId,
          variables: RequireFields<SubscriptionJobUpdatesArgs, never>
        ) => (variables.jobId ? variables.jobId === payload.id : true)
      ),
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
