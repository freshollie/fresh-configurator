import React, { useEffect } from "react";
import ConnectionSelector from "../components/ConnectionSelector";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import { useMutation, useQuery, gql } from "../gql/apollo";

const ConnectionSettingsManager: React.FC = () => {
  const [updateSettings] = useMutation(
    gql`
      mutation SetConnectionSettings($port: String!, $baudRate: Int) {
        setConnectionSettings(port: $port, baudRate: $baudRate) @client
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionSettingsManager").SetConnectionSettingsMutation,
      import("./__generated__/ConnectionSettingsManager").SetConnectionSettingsMutationVariables
    >
  );

  const log = useLogger();

  const { data: configuratorData, loading } = useQuery(
    gql`
      query ConnectionSettings {
        configurator @client {
          port
          baudRate
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionSettingsManager").ConnectionSettingsQuery,
      import("./__generated__/ConnectionSettingsManager").ConnectionSettingsQueryVariables
    >
  );
  const { port, baudRate } = configuratorData?.configurator ?? {};

  const { connected, connecting } = useConnectionState();

  // Constantly query the available ports, unless we have already
  // selected a port
  const { data: portsData, loading: loadingPorts } = useQuery(
    gql`
      query AvailablePorts {
        ports {
          id
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionSettingsManager").AvailablePortsQuery,
      import("./__generated__/ConnectionSettingsManager").AvailablePortsQueryVariables
    >,
    {
      pollInterval: 1000,
      skip: connected,
      onError: (e) => {
        log(`Error reading available ports: ${e.message}`);
      },
    }
  );

  // If this is the first load, and the currently selected port is null
  // then select the first available port
  useEffect(() => {
    if (port === null && !loadingPorts) {
      updateSettings({
        variables: {
          port: portsData?.ports[0]?.id ?? "/dev/rfcomm0",
        },
      });
    }
  }, [loading, loadingPorts, port, portsData, updateSettings]);

  // Only show the connection selector if we are not connected
  return !connected ? (
    <ConnectionSelector
      ports={portsData?.ports.map(({ id }) => id) ?? undefined}
      selectedPort={port ?? undefined}
      selectedBaud={baudRate}
      disabled={connecting}
      onChange={({ port: newPort, baud }) =>
        updateSettings({
          variables: {
            port: newPort,
            baudRate: baud,
          },
        })
      }
    />
  ) : null;
};

export default ConnectionSettingsManager;
