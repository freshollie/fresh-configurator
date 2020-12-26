import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

import { FetchResult } from "@apollo/client";
import { render, fireEvent, waitFor } from "../test-utils";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";
import {
  CallibrateAccelerometerDocument,
  CallibrateAccelerometerMutation,
} from "../gql/mutations/Device.graphql";

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
  result: (): FetchResult<CallibrateAccelerometerMutation> => {
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
