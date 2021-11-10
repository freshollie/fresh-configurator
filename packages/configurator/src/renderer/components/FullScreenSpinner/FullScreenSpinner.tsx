import { Box, Flex, Set, Text, Spinner } from "bumbag";
import React from "react";

type Props = {
  text?: string;
  image?: JSX.Element;
};

const FullScreenSpinner: React.FC<Props> = ({ text, image }) => (
  <Flex
    width="100%"
    height="100vh"
    alignItems="center"
    flexDirection={image ? "column" : undefined}
    justifyContent={!image ? "center" : undefined}
    padding="8px"
  >
    {image}
    <Box margin="20px">
      <Set>
        {text && <Text>{text}</Text>}
        <Spinner size="large" />
      </Set>
    </Box>
  </Flex>
);

export default FullScreenSpinner;
