import {
  Box,
  Breadcrumb,
  Card,
  Columns,
  Divider,
  Heading,
  Icon,
  useColorMode,
  FieldWrapper,
  FieldStack,
} from "bumbag";
import { Link as RouterLink } from "wouter";
import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Sensors } from "@betaflight/api";
import { gql, useQuery } from "../../gql/apollo";
import useConnection from "../../hooks/useConnection";
import BoardAlignmentManager from "../../managers/BoardAlignmentManager";
import CpuDefaultsManager from "../../managers/CpuDefaultsManager";
import MotorDirectionManager from "../../managers/MotorDirectionManager";
import MotorIdleSpeedManager from "../../managers/MotorIdleSpeedManager";
import BeeperManager from "../../managers/BeeperManager";
import DisabledSensorManager from "../../managers/DisabledSensorManager";

const General: React.FC = () => {
  const connection = useConnection();
  const { colorMode } = useColorMode();

  const { data } = useQuery(
    gql`
      query PortConnections {
        ports {
          id
          connectionId
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/General").PortConnectionsQuery,
      import("./__generated__/General").PortConnectionsQueryVariables
    >
  );

  const port = data?.ports.find((p) => p.connectionId === connection)?.id;

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
            <RouterLink to={`/connections/${connection}/`}>
              <Breadcrumb.Link charSet="">{port}</Breadcrumb.Link>
            </RouterLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link charSet="" isCurrent>
              General
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Box>

      <Box margin="major-1">
        <Heading padding="major-3">General settings</Heading>
        <Columns>
          <Columns.Column>
            <Card>
              <Box margin="minor-5">
                <Heading use="h5" marginBottom="minor-5">
                  CPU
                </Heading>
                <CpuDefaultsManager />
              </Box>

              <Divider />
              <Box margin="minor-5">
                <Heading use="h5" marginBottom="minor-5">
                  Motors
                </Heading>
                <FieldStack>
                  <FieldStack orientation="horizontal">
                    <FieldWrapper label="Prop direction">
                      <MotorDirectionManager />
                    </FieldWrapper>
                    <FieldWrapper label="Idle speed">
                      <MotorIdleSpeedManager />
                    </FieldWrapper>
                  </FieldStack>
                  <FieldWrapper label="Motor beeper">
                    <BeeperManager />
                  </FieldWrapper>
                </FieldStack>
              </Box>
              <Divider />
              <Box margin="minor-5">
                <Heading use="h5" marginBottom="minor-5">
                  Sensors
                </Heading>
                <FieldWrapper label="Accelerometer">
                  <DisabledSensorManager sensor={Sensors.ACCELEROMETER} />
                </FieldWrapper>
              </Box>
            </Card>
          </Columns.Column>
          <Columns.Column spread={4}>
            <Card title="Board orientation">
              <BoardAlignmentManager />
            </Card>
          </Columns.Column>
        </Columns>
      </Box>
    </Box>
  );
};

export default General;
