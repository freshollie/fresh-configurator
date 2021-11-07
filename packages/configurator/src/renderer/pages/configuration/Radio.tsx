import {
  Box,
  Card,
  Columns,
  Divider,
  FieldWrapper,
  Heading,
  FieldStack,
} from "bumbag";
import React from "react";
import ChannelMapManager from "../../managers/ChannelMapManager";
import RadioPortManager from "../../managers/RadioPortManager";
import RadioProtocolManager from "../../managers/RadioProtocolManager";
import RssiChannelManager from "../../managers/RssiChannelManager";
import SwitchesManager from "../../managers/SwitchesManager";
import ChannelsListProvider from "../../providers/ChannelsListProvider";
import ConfigurationTopBar from "./components/ConfigurationTopBar";

const Radio: React.FC = () => (
  <Box>
    <ConfigurationTopBar page="Radio" />
    <Box margin="major-1">
      <Heading padding="major-3">Radio settings</Heading>
      <Columns>
        <Columns.Column spread={7}>
          <Card>
            <Box margin="minor-5">
              <Heading use="h5" marginBottom="minor-5">
                Hardware
              </Heading>
              <FieldStack>
                <FieldStack orientation="horizontal">
                  <FieldWrapper label="Port">
                    <RadioPortManager />
                  </FieldWrapper>
                  <FieldWrapper label="Receiver type">
                    <RadioProtocolManager />
                  </FieldWrapper>
                </FieldStack>
              </FieldStack>
            </Box>

            <Divider />
            <Box margin="minor-5">
              <Heading use="h5" marginBottom="minor-5">
                Channels
              </Heading>
              <FieldStack>
                <FieldStack orientation="horizontal">
                  <FieldWrapper label="Channel Map">
                    <ChannelMapManager />
                  </FieldWrapper>
                  <FieldWrapper label="RSSI Channel">
                    <RssiChannelManager />
                  </FieldWrapper>
                </FieldStack>
              </FieldStack>
            </Box>

            <Divider />
            <Box margin="minor-5">
              <Heading use="h5" marginBottom="minor-5">
                Switches
              </Heading>
              <SwitchesManager />
            </Box>
          </Card>
        </Columns.Column>
        <Columns.Column spread={5}>
          <Box position="sticky" top="60px">
            <ChannelsListProvider refreshRate={60} />
          </Box>
        </Columns.Column>
      </Columns>
    </Box>
  </Box>
);

export default Radio;
