import React, { useState } from "react";
import { Container, Info, ResetButton } from "./ModelView.styles";
import Model, { ModelType } from "../Model";
import Paper from "../Paper";

const ModelView: React.FC<{
  modelType: ModelType;
  attitude?: { roll: number; pitch: number; heading: number };
}> = ({
  attitude: { roll, pitch, heading } = { roll: 0, pitch: 0, heading: 0 },
  modelType
}) => {
  const [headingOffset, setHeadingOffset] = useState(0);
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
            <div>{heading} deg</div>
            <div>{pitch} deg</div>
            <div>{roll} deg</div>
          </div>
        </Info>
        <ResetButton onClick={() => setHeadingOffset(-heading)}>
          Reset Z axis, offset: {headingOffset} deg
        </ResetButton>
        <Model
          name={modelType}
          attitude={{ roll, pitch, heading: heading + headingOffset }}
        />
      </Paper>
    </Container>
  );
};

export default ModelView;
