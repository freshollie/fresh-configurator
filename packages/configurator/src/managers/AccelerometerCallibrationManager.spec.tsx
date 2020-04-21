import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";

import { render, fireEvent, waitFor } from "../test-utils";
import {
  CallibrateAccelerometerDocument,
  CallibrateAccelerometerMutationResult,
} from "../gql/queries/Device.graphql";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";

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
    query: CallibrateAccelerometerDocument,
    variables: {
      connection,
    },
  },
  result: (): CallibrateAccelerometerMutationResult => {
    callback();
    return {
      data: {
        __typename: "Mutation",
        deviceCallibrateAccelerometer: null,
      },
      loading: false,
      called: true,
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
