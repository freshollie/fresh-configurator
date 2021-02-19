import {
  Features,
  SerialPortFunctions,
  SerialPortIdentifiers,
} from "@betaflight/api";
import React from "react";
import { useMutation, useQuery } from "../gql/apollo";
import {
  SetDeviceSerialFunctionsAndFeaturesDocument,
  RadioPortManagerDataDocument,
} from "./RadioPortManager.graphql";

import useConnectionState from "../hooks/useConnectionState";

const RX_FEATURES = [
  Features.RX_MSP,
  Features.RX_PARALLEL_PWM,
  Features.RX_PPM,
  Features.RX_SERIAL,
  Features.RX_SPI,
];

const RX_MODE_VALUES = [
  {
    name: "PPM",
    id: 100,
    feature: Features.RX_PPM,
  },
  {
    name: "SPI",
    id: 101,
    feature: Features.RX_SPI,
  },
  {
    name: "MSP",
    id: 102,
    feature: Features.RX_MSP,
  },
];
const featureToId = (features: readonly Features[]): number | undefined =>
  RX_MODE_VALUES.find(({ feature }) => features.includes(feature))?.id;
const idToFeature = (rxMode: number): Features =>
  RX_MODE_VALUES.find(({ id }) => rxMode === id)?.feature ?? Features.RX_SERIAL;

const RadioPortManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(RadioPortManagerDataDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setFunctionsAndFeatures, { loading: setting }] = useMutation(
    SetDeviceSerialFunctionsAndFeaturesDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: RadioPortManagerDataDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const features = data?.connection.device.features ?? [];
  const portFunctions = data?.connection.device.serial.ports ?? [];
  // To do, redesign serial ports to query available ports
  const currentPort = portFunctions.find(({ functions }) =>
    functions.includes(SerialPortFunctions.RX_SERIAL)
  )?.id;

  return (
    <div>
      <label htmlFor="radio-port">
        Flight Controller Receiver Port
        <select
          id="radio-port"
          disabled={!data || loading || setting}
          // We can assume that RX_MODE is set to one of these, if not, just show PPM
          value={featureToId(features) ?? currentPort ?? 100}
          onChange={(e) => {
            const id = Number(e.target.value);
            const enabledFeature = idToFeature(id);
            setFunctionsAndFeatures({
              variables: {
                portFunctions: portFunctions.map(
                  ({ id: portId, functions }) => ({
                    id: portId,
                    functions: functions
                      .filter((fun) => fun !== SerialPortFunctions.RX_SERIAL)
                      .concat(
                        portId === id ? [SerialPortFunctions.RX_SERIAL] : []
                      ),
                  })
                ),
                // remove any existing rx features, add add the one required for the
                features: features
                  .filter((feature) => !RX_FEATURES.includes(feature))
                  .concat(enabledFeature ? [enabledFeature] : [enabledFeature]),
                connection: connection ?? "",
              },
            });
          }}
        >
          {portFunctions.map(({ id, functions }) => (
            <option
              // Obviously not possible to set the receiver port to the current MSP port
              disabled={functions.includes(SerialPortFunctions.MSP)}
              value={id}
              key={id}
            >
              {`${SerialPortIdentifiers[id]}${
                functions.includes(SerialPortFunctions.MSP)
                  ? " (Communication port)"
                  : ""
              }`}
            </option>
          ))}
          {RX_MODE_VALUES.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default RadioPortManager;
