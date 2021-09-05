import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

import { render, fireEvent, waitFor } from "../test-utils";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";
import { gql } from "../gql/apollo";
import { ConnectionContext } from "../context/ConnectionProvider";

const mockConnectionId = "someconnectionid";

const mockCallibrateMutation = (
  connection: string,
  callback: () => void
): MockedResponse => ({
  request: {
    query: gql(/* GraphQL */ `
      mutation CallibrateAccelerometer($connection: ID!) {
        deviceCallibrateAccelerometer(connectionId: $connection)
      }
    `),
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
        mocks={[mockCallibrateMutation(mockConnectionId, callibrate)]}
      >
        <ConnectionContext.Provider value={mockConnectionId}>
          <AccelerometerCallibrationManager />
        </ConnectionContext.Provider>
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
