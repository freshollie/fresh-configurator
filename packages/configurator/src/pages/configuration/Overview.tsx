import {
  faChevronRight,
  faScrewdriver,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Card,
  Heading,
  Text,
  Columns,
  Icon,
  Set,
  Breadcrumb,
  Button,
  Flex,
  useColorMode,
} from "bumbag";
import React from "react";
import { Link as RouterLink } from "wouter";
import { gql, useQuery } from "../../gql/apollo";
import useConnection from "../../hooks/useConnection";
import FcSummaryProvider from "../../providers/FcSummaryProvider";
import GpsSummaryProvider from "../../providers/GpsSummaryProvider";
import ModelViewProvider from "../../providers/ModelViewProvider";
import SensorsListProvider from "../../providers/SensorListProvider";

const Overview: React.FC = () => {
  const connection = useConnection();
  const { colorMode } = useColorMode();

  const { data } = useQuery(
    gql`
      query DeviceData($connection: ID!) {
        connection(connectionId: $connection) {
          port
          device {
            name
            info {
              manufacturerId
              boardName
              boardType
              targetName
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/Overview").DeviceDataQuery,
      import("./__generated__/Overview").DeviceDataQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );

  return (
    <Box>
      <Box
        position="sticky"
        top="0px"
        padding="major-2"
        zIndex="999"
        backgroundColor="default"
        border={colorMode !== "dark" ? "default" : "none"}
        borderTop="none"
        borderRight="none"
        borderLeft="none"
      >
        <Breadcrumb
          separator={
            <Icon
              icon={faChevronRight}
              type="font-awesome"
              color="gray100"
              fontSize="150"
            />
          }
        >
          <Breadcrumb.Item>
            <RouterLink to="/">
              <Breadcrumb.Link charSet="">Home</Breadcrumb.Link>
            </RouterLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link charSet="" isCurrent>
              {data?.connection.port}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Flex>
          <Box margin="major-5">
            <Heading>{data?.connection.device.name}</Heading>
            <SensorsListProvider />
            <Text margin="minor-1">
              {data?.connection.device.info.boardName} -{" "}
              {data?.connection.device.info.targetName}
            </Text>
          </Box>
          <Box alignY="bottom">
            <Set>
              <RouterLink to={`/connections/${connection}/general`}>
                <Button>
                  <Box>
                    <Box alignX="center" padding="minor-1">
                      <Icon
                        icon={faWrench}
                        fontSize="700"
                        type="font-awesome"
                      />
                    </Box>
                    <Box>
                      <Text>General</Text>
                    </Box>
                  </Box>
                </Button>
              </RouterLink>
              <RouterLink to="receiver">
                <Button>
                  <Box>
                    <Box alignX="center" padding="minor-1">
                      <Icon icon="receiver" fontSize="700" />
                    </Box>
                    <Box>
                      <Text>Radio</Text>
                    </Box>
                  </Box>
                </Button>
              </RouterLink>
              <RouterLink to="tuning">
                <Button>
                  <Box>
                    <Box alignX="center" padding="minor-1">
                      <Icon
                        icon={faScrewdriver}
                        fontSize="700"
                        type="font-awesome"
                      />
                    </Box>
                    <Box>
                      <Text>Tuning</Text>
                    </Box>
                  </Box>
                </Button>
              </RouterLink>
              <RouterLink to="blackbox">
                <Button>
                  <Box>
                    <Box alignX="center" padding="minor-1">
                      <Icon icon="blackbox-log" fontSize="700" />
                    </Box>
                    <Box>
                      <Text>Blackbox</Text>
                    </Box>
                  </Box>
                </Button>
              </RouterLink>
            </Set>
          </Box>
        </Flex>
      </Box>
      <Box margin="major-1">
        <Columns>
          <Columns.Column spread={4}>
            <Card title="Info" marginBottom="major-1">
              <FcSummaryProvider refreshRate={5} />
            </Card>
            <Card title="Gps">
              <GpsSummaryProvider refreshRate={5} />
            </Card>
          </Columns.Column>
          <Columns.Column spread={8}>
            <Box
              height="calc(100vh - 300px)"
              borderColor="default"
              borderRadius="1"
            >
              <ModelViewProvider refreshRate={60} />
            </Box>
          </Columns.Column>
        </Columns>
      </Box>
    </Box>
  );
};

export default Overview;
