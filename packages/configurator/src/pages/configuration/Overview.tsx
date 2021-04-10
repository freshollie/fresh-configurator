import { faScrewdriver, faWrench } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Card,
  Heading,
  Text,
  Columns,
  Icon,
  Set,
  Button,
  Flex,
} from "bumbag";
import React from "react";
import { Link as RouterLink } from "wouter";
import { gql, useQuery } from "../../gql/apollo";
import useConnection from "../../hooks/useConnection";
import ResetManager from "../../managers/ResetManager";
import FcSummaryProvider from "../../providers/FcSummaryProvider";
import GpsSummaryProvider from "../../providers/GpsSummaryProvider";
import ModelViewProvider from "../../providers/ModelViewProvider";
import SensorsListProvider from "../../providers/SensorListProvider";
import ConfigurationTopBar from "./components/ConfigurationTopBar";

const Overview: React.FC = () => {
  const connection = useConnection();

  const { data } = useQuery(
    gql`
      query DeviceData($connection: ID!) {
        connection(connectionId: $connection) {
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
      <ConfigurationTopBar>
        <Flex>
          <Box margin="major-5" minWidth="7">
            <Heading textOverflow="ellipsis" maxWidth="400px">
              {data?.connection.device.name}
            </Heading>
            <SensorsListProvider />
            <Text margin="minor-1">
              {data?.connection.device.info.boardName} -{" "}
              {data?.connection.device.info.targetName}
            </Text>
          </Box>
          <Box alignY="bottom" flexGrow="1">
            <Box alignX="right">
              <ResetManager />
            </Box>
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
              <RouterLink to={`/connections/${connection}/radio`}>
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
              <RouterLink to={`/connections/${connection}/blackbox`}>
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
      </ConfigurationTopBar>
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
