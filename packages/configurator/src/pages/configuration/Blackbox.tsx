import { Box, Set, Heading, Card, FieldWrapper, FieldStack } from "bumbag";
import React from "react";
import BlackboxDeviceManager from "../../managers/BlackboxDeviceManager";
import BlackboxFlashManager from "../../managers/BlackboxFlashManager";
import BlackboxSampleRateManager from "../../managers/BlackboxSampleRateManager";
import BlackboxFlashInfoProvider from "../../providers/BlackboxFlashInfoProvider";
import ConfigurationTopBar from "./components/ConfigurationTopBar";

const Blackbox: React.FC = () => (
  <Box>
    <ConfigurationTopBar page="Blackbox" />
    <Box margin="major-1">
      <Heading padding="major-3" paddingBottom="0px">
        Blackbox
      </Heading>
      <Set padding="major-3" spacing="minor-5">
        <Box flexGrow={"1" as never}>
          <BlackboxFlashInfoProvider />
        </Box>
        <Box alignSelf="flex-end" justifyContent="center">
          <BlackboxFlashManager />
        </Box>
      </Set>
      <Card>
        <FieldStack orientation="horizontal">
          <FieldWrapper label="Logging device">
            <BlackboxDeviceManager />
          </FieldWrapper>
          <FieldWrapper label="Sample rate">
            <BlackboxSampleRateManager />
          </FieldWrapper>
        </FieldStack>
      </Card>
    </Box>
  </Box>
);

export default Blackbox;
