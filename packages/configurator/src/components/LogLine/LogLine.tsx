import React from "react";
import { format } from "date-fns";

export interface LogLineProps {
  time: Date;
  children: React.ReactText | React.ReactText[];
}

const LogLine: React.FC<LogLineProps> = ({ time, children }) => (
  <div
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `${format(time, "yyyy-MM-dd @ HH:mm:ss")} -- ${children}`
    }}
  />
);

export default LogLine;
