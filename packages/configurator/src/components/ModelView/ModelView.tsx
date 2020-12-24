import React, { useState } from "react";
import { Container, Info, ResetButton } from "./ModelView.styles";
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
    <Container>
      <Paper>
        <Info>
          <div>
            <div>Heading:</div>
            <div>Pitch:</div>
            <div>Roll:</div>
          </div>
          <div>
            <div>{yaw} deg</div>
            <div>{pitch} deg</div>
            <div>{roll} deg</div>
          </div>
        </Info>
        <ResetButton onClick={() => setYawOffset(-yaw)}>
          Reset Z axis, offset: {yawOffset} deg
        </ResetButton>
        <Model
          name={modelType}
          attitude={{ roll, pitch, yaw: yaw + yawOffset }}
        />
      </Paper>
    </Container>
  );
};

export default ModelView;
