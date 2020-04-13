import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

import { render, fireEvent, waitFor } from "../test-utils";
import { CallibrateAccelerometerDocument } from "../gql/__generated__";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";

const mockConnectionId = "someconnectionid";

const clientResolvers = {
  Query: {
    configurator: () => ({
      connection: mockConnectionId,
      connecting: false,
    }),
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
  result: () => {
    callback();
    return {
      data: null,
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
