import { Box, Heading } from "bumbag";
import React from "react";
import ConfigurationTopBar from "./components/ConfigurationTopBar";

const Blackbox: React.FC = () => (
  <Box>
    <ConfigurationTopBar page="Blackbox" />
    <Box margin="major-1">
      <Heading padding="major-3">Blackbox</Heading>
    </Box>
  </Box>
);

export default Blackbox;
