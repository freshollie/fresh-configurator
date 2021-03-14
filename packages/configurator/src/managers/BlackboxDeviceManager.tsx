import { BlackboxDevices, blackboxDevices } from "@betaflight/api";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";

const BlackboxDeviceManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(
    gql`
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
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxDeviceManager").BlackboxDeviceAndVersionQuery,
      import("./__generated__/BlackboxDeviceManager").BlackboxDeviceAndVersionQueryVariables
    >,
    {
      variables: {
        connection,
      },
      skip: !connection,
    }
  );

  const [setBlackBoxDevice, { loading: setting }] = useMutation(
    gql`
      mutation SetBlackboxDevice($connection: ID!, $device: Int!) {
        deviceSetBlackboxConfig(
          connectionId: $connection
          config: { device: $device }
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxDeviceManager").SetBlackboxDeviceMutation,
      import("./__generated__/BlackboxDeviceManager").SetBlackboxDeviceMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql`
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
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/BlackboxDeviceManager").BlackboxDeviceQuery,
            import("./__generated__/BlackboxDeviceManager").BlackboxDeviceQueryVariables
          >,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const devices = blackboxDevices(data?.connection.apiVersion ?? "0.0.0");

  return (
    <select
      disabled={loading || setting}
      value={data?.connection.device.blackbox.config.device ?? -1}
      onChange={(e) => {
        if (!connection) {
          return;
        }
        setBlackBoxDevice({
          variables: {
            connection,
            device: Number(e.target.value),
          },
        });
      }}
    >
      {devices.map((device) => (
        <option key={device} value={device}>
          {BlackboxDevices[device]}
        </option>
      ))}
    </select>
  );
};

export default BlackboxDeviceManager;
