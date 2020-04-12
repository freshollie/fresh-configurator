import { Resolvers } from "../__generated__";

const resolvers: Resolvers = {
  Query: {
    ports: (_, __, { msp }) => msp.ports(),
  },
};

export default resolvers;
