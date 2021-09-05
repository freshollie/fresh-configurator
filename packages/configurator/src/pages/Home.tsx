import {
  Box,
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
import { faCog, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { SupaflyLogo } from "../logos";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useLogger from "../hooks/useLogger";
import config from "../config";
import { Port } from "../gql/__generated__/schema";

const portConnectionStateQuery = gql(/* GraphQL */ `
  query PortConnectionState($id: String!) {
    port(id: $id) {
      id
      connecting
      connectionId
    }
  }
`);
const Device: React.FC<{ details: Port }> = ({ details }) => {
  const log = useLogger();
  const [, setLocation] = useLocation();
  const [connecting, setConnecting] = useState(false);
  const { colorMode } = useColorMode();

  const [disconnectMutation] = useMutation(
    gql(/* GraphQL */ `
      mutation Disconnect($connection: ID!) {
        close(connectionId: $connection)
      }
    `),
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
    gql(/* GraphQL */ `
      mutation Connect($port: String!, $baudRate: Int!) {
        connect(port: $port, baudRate: $baudRate) {
          id
          apiVersion
        }
      }
    `),
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
    gql(/* GraphQL */ `
      query ConnectionDetails($connection: ID!) {
        connection(connectionId: $connection) {
          apiVersion
          device {
            name
          }
        }
      }
    `),
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
    <Box
      width="100%"
      userSelect="none"
      padding="major-5"
      role="group"
      _hover={{ backgroundColor: colorMode === "dark" ? "default" : "gray100" }}
    >
      <Level minHeight="100px">
        <Box width="100%">
          <Heading use="h4">{details.id}</Heading>
          {error && !connecting && (
            <Alert
              width="100%"
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
            {details.serialNumber && (
              <List.Item>{details.serialNumber}</List.Item>
            )}
            {apiVersion && (
              <List.Item color={badVersion ? "danger" : undefined}>
                {apiVersion}
              </List.Item>
            )}
            {data?.connection && (
              <List.Item>{data.connection.device.name}</List.Item>
            )}
          </List>
        </Box>
        <Box width="150px" minHeight="inherit" alignX="center" alignY="center">
          <Set orientation="vertical">
            {!details.connectionId && (
              <Button
                _groupHover={{
                  backgroundColor: "success",
                  color: "white",
                }}
                size="small"
                palette="default"
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
                palette="danger"
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
                iconAfter={faCog}
                iconAfterProps={{ type: "font-awesome" }}
              >
                Configure
              </Button>
            )}
          </Set>
        </Box>
      </Level>
    </Box>
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
    gql(/* GraphQL */ `
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
    `),
    {
      pollInterval: 1000,
    }
  );

  const ports = data?.ports ?? [];
  return (
    <Box>
      <Flex>
        <Box
          flexGrow={"1" as never}
          height="100vh"
          backgroundColor="warning400"
          position="sticky"
          top="0px"
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
                loading="eager"
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
                  <Link fontSize="400" color="black" href="/flash">
                    Flashing
                  </Link>
                </RouterLink>
                <RouterLink to="/help">
                  <Link fontSize="400" color="black" href="/help">
                    Help
                  </Link>
                </RouterLink>
              </Set>
            </Box>
            <Box padding="minor-1" position="absolute" right="0px" bottom="0px">
              <ThemeSelector />
            </Box>
          </Flex>
        </Box>

        <Box maxWidth="600px" width="100%" height="100%" minHeight="100vh">
          <Set orientation="vertical">
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
