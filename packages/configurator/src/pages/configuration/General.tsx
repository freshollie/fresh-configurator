import {
  Box,
  Card,
  Columns,
  Divider,
  Heading,
  FieldWrapper,
  FieldStack,
} from "bumbag";
import React from "react";
import { Sensors } from "@betaflight/api";
import BoardAlignmentManager from "../../managers/BoardAlignmentManager";
import CpuDefaultsManager from "../../managers/CpuDefaultsManager";
import MotorDirectionManager from "../../managers/MotorDirectionManager";
import MotorIdleSpeedManager from "../../managers/MotorIdleSpeedManager";
import BeeperManager from "../../managers/BeeperManager";
import DisabledSensorManager from "../../managers/DisabledSensorManager";
import ConfigurationTopBar from "./components/ConfigurationTopBar";

const General: React.FC = () => (
  <Box>
    <ConfigurationTopBar page="General" />

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

export default General;
