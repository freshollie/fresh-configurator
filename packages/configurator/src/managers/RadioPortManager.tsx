import {
  Features,
  SerialPortFunctions,
  SerialPortIdentifiers,
} from "@betaflight/api";
import React from "react";
import { Select } from "bumbag";
import { useMutation, useQuery, gql } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const RX_FEATURES = [
  Features.RX_MSP,
  Features.RX_PARALLEL_PWM,
  Features.RX_PPM,
  Features.RX_SERIAL,
  Features.RX_SPI,
];

const SERIAL_TELEMENTRY = [
  SerialPortFunctions.TELEMETRY_FRSKY,
  SerialPortFunctions.TELEMETRY_HOTT,
  SerialPortFunctions.TELEMETRY_IBUS,
  SerialPortFunctions.TELEMETRY_LTM,
  SerialPortFunctions.TELEMETRY_MAVLINK,
  SerialPortFunctions.TELEMETRY_SMARTPORT,
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

const DataQuery = gql`
  query RadioPortManagerData($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        serial {
          ports {
            id
            functions
          }
        }
        features
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/RadioPortManager").RadioPortManagerDataQuery,
  import("./__generated__/RadioPortManager").RadioPortManagerDataQueryVariables
>;

const RadioPortManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(DataQuery, {
    variables: {
      connection,
    },
  });

  const [setFunctionsAndFeatures, { loading: setting }] = useMutation(
    gql`
      mutation SetDeviceSerialFunctionsAndFeatures(
        $connection: ID!
        $portFunctions: [PortFunctionsInput!]!
        $features: [Int!]!
      ) {
        deviceSetSerialFunctions(
          connectionId: $connection
          portFunctions: $portFunctions
        )
        deviceSetFeatures(connectionId: $connection, features: $features)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/RadioPortManager").SetDeviceSerialFunctionsAndFeaturesMutation,
      import("./__generated__/RadioPortManager").SetDeviceSerialFunctionsAndFeaturesMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: DataQuery,
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
    <Select
      disabled={!data || loading || setting}
      // We can assume that RX_MODE is set to one of these, if not, just show PPM
      value={featureToId(features) ?? currentPort ?? 100}
      onChange={(e) => {
        const id = Number((e.target as unknown as { value: string }).value);
        const enabledFeature = idToFeature(id);
        setFunctionsAndFeatures({
          variables: {
            portFunctions: portFunctions.map(({ id: portId, functions }) => ({
              id: portId,
              functions: functions
                .filter((fun) => {
                  // remove the serial function from all ports
                  if (fun === SerialPortFunctions.RX_SERIAL) {
                    return false;
                  }
                  // and if this the port to be set, remove any function
                  // which is note related to telemetry
                  return !SERIAL_TELEMENTRY.includes(fun)
                    ? portId !== id
                    : true;
                })
                .concat(portId === id ? [SerialPortFunctions.RX_SERIAL] : []),
            })),
            // remove any existing rx features, add add the one required for the
            features: features
              .filter((feature) => !RX_FEATURES.includes(feature))
              .concat(enabledFeature ? [enabledFeature] : []),
            connection,
          },
        });
      }}
      options={[
        ...portFunctions.map(({ id, functions }) => ({
          label: `${SerialPortIdentifiers[id]}${
            functions.includes(SerialPortFunctions.MSP)
              ? " (Communication port)"
              : ""
          }`,
          value: id,
          disabled: functions.includes(SerialPortFunctions.MSP),
        })),
        ...RX_MODE_VALUES.map(({ id, name }) => ({ label: name, value: id })),
      ]}
    />
  );
};

export default RadioPortManager;
