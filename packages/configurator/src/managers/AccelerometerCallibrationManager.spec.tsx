import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

import { render, fireEvent, waitFor } from "../test-utils";
import {
  ConnectionSettingsDocument,
  CallibrateAccelerometerDocument,
} from "../gql/__generated__";
import AccelerometerCallibrationManager from "./AccelerometerCallibrationManager";

const ConnectionSettingsMock: MockedResponse = {
  request: {
    query: ConnectionSettingsDocument,
  },
  result: {
    data: {
      __typename: "Query",
      configurator: {
        __typename: "Configurator",
        port: "/dev/someport",
        baudRate: 1111,
      },
    },
  },
};

const mockCallibrateMutation = (
  port: string,
  callback: () => void
): MockedResponse => ({
  request: {
    query: CallibrateAccelerometerDocument,
    variables: {
      port,
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
        addTypename
        mocks={[
          ConnectionSettingsMock,
          mockCallibrateMutation("/dev/someport", callibrate),
        ]}
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
