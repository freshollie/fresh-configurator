import {
  Box,
  Card,
  Set,
  Heading,
  List,
  Button,
  Level,
  TopNav,
  Alert,
  useColorMode,
} from "bumbag";
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import semver from "semver";
import { LandingLogo } from "../logos";
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
    <Card borderRadius="1" width="400px">
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

const Home: React.FC = () => {
  const { colorMode, setColorMode } = useColorMode();
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
      <TopNav borderBottom="default" height="100px" selectedId="home">
        <TopNav.Section>
          <TopNav.Item>
            <Box width="300px" alignY="center">
              <LandingLogo />
            </Box>
          </TopNav.Item>
          <Link to="/">
            <TopNav.Item navId="home">Home</TopNav.Item>
          </Link>
          <Link to="/help">
            <TopNav.Item navId="help">Help</TopNav.Item>
          </Link>
          <Link to="/flash">
            <TopNav.Item navId="flash">Flash</TopNav.Item>
          </Link>
          <Button
            onClick={() =>
              setColorMode(colorMode === "dark" ? "default" : "dark")
            }
          >
            {colorMode === "dark" ? "Light" : "Dark"}
          </Button>
        </TopNav.Section>
      </TopNav>
      <Set
        alignY="center"
        alignX="center"
        orientation="vertical"
        padding="major-6"
      >
        {ports.map((port) => (
          <Device key={port.id} details={port} />
        ))}
      </Set>
    </Box>
  );
};

export default Home;
