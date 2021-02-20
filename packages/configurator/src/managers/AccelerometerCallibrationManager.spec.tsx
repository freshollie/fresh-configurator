import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

import { render, fireEvent, waitFor } from "../test-utils";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";
import { gql } from "../gql/apollo";

const mockConnectionId = "someconnectionid";

const log = jest.fn();

const clientResolvers = {
  Query: {
    configurator: () => ({
      connection: mockConnectionId,
      connecting: false,
      __typename: "Configurator",
    }),
  },
  Mutation: {
    log,
  },
};

const mockCallibrateMutation = (
  connection: string,
  callback: () => void
): MockedResponse => ({
  request: {
    query: gql`
      mutation CallibrateAccelerometer($connection: ID!) {
        deviceCallibrateAccelerometer(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/AccelerometerCallibrationManager.spec").CallibrateAccelerometerMutation,
      import("./__generated__/AccelerometerCallibrationManager.spec").CallibrateAccelerometerMutationVariables
    >,
    variables: {
      connection,
    },
  },
  result: () => {
    callback();
    return {
      data: {
        __typename: "Mutation",
        deviceCallibrateAccelerometer: null,
      },
    };
  },
  delay: 100,
});

describe("AccelerometerCallibrationManager", () => {
  it("should callibrate the device accelerometer when button is clicked", async () => {
    const callibrate = jest.fn();
    const { getByTestId } = render(
      <MockedProvider
        resolvers={clientResolvers}
        mocks={[mockCallibrateMutation(mockConnectionId, callibrate)]}
      >
        <AccelerometerCallibrationManager />
      </MockedProvider>
    );

    await waitFor(() =>
      expect(getByTestId("calibrate-acc-button")).toBeEnabled()
    );

    expect(getByTestId("calibrate-acc-button")).toMatchSnapshot();
    fireEvent.click(getByTestId("calibrate-acc-button"));

    await waitFor(() =>
      expect(getByTestId("calibrate-acc-button")).toBeDisabled()
    );
    expect(getByTestId("calibrate-acc-button")).toMatchSnapshot();

    await waitFor(() =>
      expect(getByTestId("calibrate-acc-button")).toBeEnabled()
    );
    expect(getByTestId("calibrate-acc-button")).toMatchSnapshot();
    expect(callibrate).toHaveBeenCalled();
  });
});
