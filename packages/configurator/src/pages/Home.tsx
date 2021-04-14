import {
  Box,
  Card,
  Set,
  Heading,
  List,
  Button,
  Level,
  Alert,
  Image,
  Flex,
  Link,
  useColorMode,
  Icon,
} from "bumbag";
import React, { useState } from "react";
import { useLocation, Link as RouterLink } from "wouter";
import semver from "semver";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { SupaflyLogo } from "../logos";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useLogger from "../hooks/useLogger";
import config from "../config";
import { Port } from "../gql/__generated__/schema";

const portConnectionStateQuery = gql`
  query PortConnectionState($id: String!) {
    port(id: $id) {
      id
      connecting
      connectionId
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/Home").PortConnectionStateQuery,
  import("./__generated__/Home").PortConnectionStateQueryVariables
>;
const Device: React.FC<{ details: Port }> = ({ details }) => {
  const log = useLogger();
  const [, setLocation] = useLocation();
  const [connecting, setConnecting] = useState(false);

  const [disconnectMutation] = useMutation(
    gql`
      mutation Disconnect($connection: ID!) {
        close(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/Home").DisconnectMutation,
      import("./__generated__/Home").DisconnectMutationVariables
    >,
    {
      variables: {
        connection: details.connectionId ?? "",
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: portConnectionStateQuery,
          variables: {
            id: details.id,
          },
        },
      ],
    }
  );

  const disconnect = (notify = true): Promise<void> =>
    disconnectMutation()
      .then(() => {
        if (notify) {
          log(
            `Serial port <span class="message-positive">successfully</span> closed for connectionId=${details.connectionId}`
          );
        }
      })
      .catch((e) => {
        if (notify) {
          log(`Error closing connection: ${e.message}`);
        }
      });

  const [connect, { error }] = useMutation(
    gql`
      mutation Connect($port: String!, $baudRate: Int!) {
        connect(port: $port, baudRate: $baudRate) {
          id
          apiVersion
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/Home").ConnectMutation,
      import("./__generated__/Home").ConnectMutationVariables
    >,
    {
      context: { retry: false },
      variables: {
        port: details.id,
        baudRate: 115200,
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: portConnectionStateQuery,
          variables: {
            id: details.id,
          },
        },
      ],
      onError: () => {
        setConnecting(false);
      },
      onCompleted: () => {
        setConnecting(false);
      },
    }
  );

  const { data } = useQuery(
    gql`
      query ConnectionDetails($connection: ID!) {
        connection(connectionId: $connection) {
          apiVersion
          device {
            name
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/Home").ConnectionDetailsQuery,
      import("./__generated__/Home").ConnectionDetailsQueryVariables
    >,
    {
      variables: {
        connection: details.connectionId ?? "",
      },
      skip: !details.connectionId || connecting || details.connecting,
    }
  );
  const apiVersion = data?.connection.apiVersion;
  const badVersion = semver.lt(
    apiVersion ?? "0.0.0",
    config.apiVersionAccepted
  );
  return (
    <Card borderRadius="5" width="400px" variant="bordered">
      <Heading use="h4">{details.id}</Heading>
      {error && !connecting && (
        <Alert
          variant="tint"
          type="warning"
          title="Could not establish connection"
        >
          {error.message}
        </Alert>
      )}
      {apiVersion && badVersion && (
        <Alert variant="tint" type="danger" title="Unsupported device">
          Device API version is too old
        </Alert>
      )}
      <List padding="major-1">
        {details.vendorId && details.productId && (
          <List.Item>
            {details.vendorId}:{details.productId}
          </List.Item>
        )}
        {details.serialNumber && <List.Item>{details.serialNumber}</List.Item>}
        {apiVersion && (
          <List.Item color={badVersion ? "danger" : undefined}>
            {apiVersion}
          </List.Item>
        )}
        {data?.connection && (
          <List.Item>{data.connection.device.name}</List.Item>
        )}
      </List>
      <Level>
        {!details.connectionId && (
          <Button
            size="small"
            color="secondary"
            data-testid="connect-button"
            disabled={details.connecting || connecting}
            isLoading={details.connecting || connecting}
            onClick={() => {
              setConnecting(true);
              connect();
            }}
          >
            Connect
          </Button>
        )}
        {details.connectionId && (
          <Button
            size="small"
            color="danger"
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </Button>
        )}
        {details.connectionId && (
          <Button
            size="small"
            data-testid="configure-button"
            disabled={badVersion}
            onClick={() => {
              setLocation(`/connections/${details.connectionId}/`);
            }}
          >
            Configure
          </Button>
        )}
      </Level>
    </Card>
  );
};

const ThemeSelector: React.FC = () => {
  const { colorMode, setColorMode } = useColorMode();
  return (
    <Button
      variant="ghost"
      onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
    >
      <Icon icon={colorMode === "dark" ? faSun : faMoon} type="font-awesome" />
    </Button>
  );
};

const Home: React.FC = () => {
  const { data } = useQuery(
    gql`
      query Ports {
        ports {
          id
          connecting
          connectionId
          manufacturer
          vendorId
          productId
          serialNumber
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/Home").PortsQuery,
      import("./__generated__/Home").PortsQueryVariables
    >,
    {
      pollInterval: 1000,
    }
  );

  const ports = data?.ports ?? [];
  return (
    <Box>
      <Flex>
        <Box
          flexGrow="1"
          height="100vh"
          backgroundColor="warning400"
          position="sticky"
          top="0"
        >
          <Flex
            flexWrap="wrap"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            position="relative"
          >
            <Box borderRight="default" padding="major-5" position="relative">
              <Image
                loading={false}
                referrerPolicy=""
                src={SupaflyLogo}
                minWidth="400px"
                width="100%"
                maxWidth="800px"
              />
            </Box>
            <Box paddingBottom="major-5">
              <Set spacing="major-5">
                <RouterLink to="/flash">
                  <Link charSet="" fontSize="400" color="black" href="/flash">
                    Flashing
                  </Link>
                </RouterLink>
                <RouterLink to="/help">
                  <Link charSet="" fontSize="400" color="black" href="/help">
                    Help
                  </Link>
                </RouterLink>
              </Set>
            </Box>
            <Box padding="minor-1" position="absolute" right="0" bottom="0">
              <ThemeSelector />
            </Box>
          </Flex>
        </Box>

        <Box
          maxWidth="800px"
          width="100%"
          height="100%"
          minHeight="100vh"
          alignY="center"
          alignX="center"
          padding="major-5"
        >
          <Set orientation="vertical" spacing="major-3">
            {ports.map((port) => (
              <Device key={port.id} details={port} />
            ))}
          </Set>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
