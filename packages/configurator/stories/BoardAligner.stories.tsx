import React, { useState } from "react";
import BoardAligner from "../src/components/BoardAligner";

export default {
  title: "Components/Board Aligner",
  component: BoardAligner,
};

export const Normal: React.FC = () => {
  const [alignment, setAlignment] = useState({ roll: 0, pitch: 0, yaw: 0 });
  return <BoardAligner alignment={alignment} onChange={setAlignment} />;
};
