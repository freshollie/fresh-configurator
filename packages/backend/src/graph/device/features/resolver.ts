import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    features: ({ port }, _, { msp }) =>
      msp
        .readFeatures(port)
        .then((features) =>
          features.map((feature) => ({ ...feature, __typename: "Feature" }))
        ),
  },
};

export default resolvers;
