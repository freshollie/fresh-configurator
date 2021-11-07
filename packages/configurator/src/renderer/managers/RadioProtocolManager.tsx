import React from "react";
import {
  RcSmoothingTypes,
  SerialPortFunctions,
  SerialRxProviders,
} from "@betaflight/api";
import { Select } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const PROVIDERS = [
  {
    label: "FrSky",
    value: SerialRxProviders.SBUS,
  },
  { label: "FlySky", value: SerialRxProviders.IBUS },
  { label: "CrossFire", value: SerialRxProviders.CRSF },
];

const DataQuery = gql(/* GraphQL */ `
  query RadioProtocolManagerData($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        rc {
          receiver {
            serialProvider
          }
          smoothing {
            type
          }
        }
      }
    }
  }
`);

const RadioProtocolManager: React.FC = () => {
  const connection = useConnection();
  const { data: serialPortsData } = useQuery(
    gql(/* GraphQL */ `
      query SerialPortFunctions($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            serial {
              ports {
                id
                functions
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
      },
      skip: !connection,
    }
  );
  const { data, loading } = useQuery(DataQuery, {
    variables: {
      connection,
    },
    skip: !connection,
  });
  const [setReceiverConfig, { loading: setting }] = useMutation(
    gql(/* GraphQL */ `
      mutation SetReceiverProtocolAndSmoothingData(
        $connection: ID!
        $serialProvider: Int
        $smoothingType: Int!
      ) {
        deviceSetReceiverConfig(
          connectionId: $connection
          receiverConfig: { serialProvider: $serialProvider }
        )
        deviceSetRcSmoothingConfig(
          connectionId: $connection
          smoothingConfig: { type: $smoothingType }
        )
      }
    `),
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

  const hasSerialPortSet =
    !!serialPortsData?.connection.device.serial.ports.find(({ functions }) =>
      functions.includes(SerialPortFunctions.RX_SERIAL)
    );
  const selectedProtocol =
    data?.connection.device.rc.receiver.serialProvider ?? -1;

  const smoothingSet =
    data?.connection.device.rc.smoothing.type ===
    RcSmoothingTypes.INTERPOLATION;

  return (
    <Select
      disabled={loading || setting || !hasSerialPortSet}
      // Make out that the protocol needs to be set if
      // the smoothing is not set
      value={smoothingSet ? selectedProtocol : -1}
      onChange={(e) => {
        const serialProvider = Number(
          (e.target as unknown as { value: string }).value
        );
        setReceiverConfig({
          variables: {
            connection,
            serialProvider,
            smoothingType: RcSmoothingTypes.INTERPOLATION,
          },
        });
      }}
      options={[
        {
          label: "Select protocol",
          value: "-1",
          disabled: true,
        },
        ...PROVIDERS,
      ]}
    />
  );
};

export default RadioProtocolManager;
