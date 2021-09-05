import { BlackboxDevices, blackboxDevices } from "@betaflight/api";
import { Select } from "bumbag";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const BlackboxDeviceManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(
    gql(/* GraphQL */ `
      query BlackboxDeviceAndVersion($connection: ID!) {
        connection(connectionId: $connection) {
          apiVersion
          device {
            blackbox {
              config {
                device
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
    }
  );

  const [setBlackBoxDevice, { loading: setting }] = useMutation(
    gql(/* GraphQL */ `
      mutation SetBlackboxDevice($connection: ID!, $device: Int!) {
        deviceSetBlackboxConfig(
          connectionId: $connection
          config: { device: $device }
        )
      }
    `),
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql(/* GraphQL */ `
            query BlackboxDevice($connection: ID!) {
              connection(connectionId: $connection) {
                device {
                  blackbox {
                    config {
                      device
                    }
                  }
                }
              }
            }
          `),
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const devices = blackboxDevices(data?.connection.apiVersion ?? "0.0.0");

  return (
    <Select
      disabled={loading || setting}
      value={data?.connection.device.blackbox.config.device ?? -1}
      onChange={(e) => {
        if (!connection) {
          return;
        }
        setBlackBoxDevice({
          variables: {
            connection,
            device: Number((e.target as unknown as { value: string }).value),
          },
        });
      }}
      options={devices.map((device) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        label: BlackboxDevices[device]!,
        value: device,
      }))}
    />
  );
};

export default BlackboxDeviceManager;
