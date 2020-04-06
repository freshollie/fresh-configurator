import React from "react";
import { format } from "date-fns";
import { Wrapper } from "./LogLine.styles";

export interface LogLineProps {
  time: Date;
  children: React.ReactText | React.ReactText[];
}

const LogLine: React.FC<LogLineProps> = ({ time, children }) => (
  <Wrapper
    // because logs can contain specific elements and classes
    // innerHTML has to be set
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `${format(time, "yyyy-MM-dd @ HH:mm:ss")} -- ${children}`,
    }}
  />
);

export default LogLine;
