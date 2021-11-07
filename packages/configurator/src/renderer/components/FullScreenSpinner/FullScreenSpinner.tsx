import { Box, Flex, Set, Text, Spinner } from "bumbag";
import React from "react";

type Props = {
  text?: string;
};

const FullScreenSpinner: React.FC<Props> = ({ text }) => (
  <Flex width="100%" height="100vh" justifyContent="center" alignItems="center">
    <Box>
      <Set>
        {text && <Text>{text}</Text>}
        <Spinner size="large" />
      </Set>
    </Box>
  </Flex>
);

export default FullScreenSpinner;
