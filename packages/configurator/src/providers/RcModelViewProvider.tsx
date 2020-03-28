import React, { useState } from "react";
import useSelectedPort from "../hooks/useSelectedPort";
import { useRcChannelsQuery } from "../gql/__generated__";

const RcModelViewProvider: React.FC = () => {
  const [attitude, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    heading: 0
  });

  const port = useSelectedPort();
  const { data } = useRcChannelsQuery({
    variables: {
      port
    }
  });

  const channels = data?.device.rc.channels ?? [0, 0, 0, 0];
};
