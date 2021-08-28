import React, { useState } from "react";
import { Button, Columns, Text, Box, Level } from "bumbag";
import Model, { ModelTypes } from "../Model";
import Paper from "../Paper";

const ModelView: React.FC<{
  modelType: ModelTypes;
  attitude?: { roll: number; pitch: number; yaw: number };
}> = ({
  attitude: { roll, pitch, yaw } = { roll: 0, pitch: 0, yaw: 0 },
  modelType,
}) => {
  const [yawOffset, setYawOffset] = useState(0);
  return (
    <Box position="relative" height="100%">
      <Paper>
        <Level width="100%" position="absolute" padding="minor-2" zIndex={10}>
          <Columns fontSize="100">
            <Columns.Column>
              <Box>
                <Text>Heading:</Text>
              </Box>
              <Box>
                <Text>Pitch:</Text>
              </Box>
              <Box>
                <Text>Roll:</Text>
              </Box>
            </Columns.Column>
            <Columns.Column>
              <Box width="100%">
                <Text textAlign="right">{yaw} deg</Text>
              </Box>
              <Box width="100%">
                <Text textAlign="right">{pitch} deg</Text>
              </Box>
              <Box width="100%">
                <Text textAlign="right">{roll} deg</Text>
              </Box>
            </Columns.Column>
          </Columns>
          <Box>
            <Button onClick={() => setYawOffset(-yaw)} size="small">
              Reset Z axis, offset: {yawOffset} deg
            </Button>
          </Box>
        </Level>
        <Model
          name={modelType}
          attitude={{ roll, pitch, yaw: yaw + yawOffset }}
        />
      </Paper>
    </Box>
  );
};

export default ModelView;
