import React from "react";
import StatusList from "../src/components/StatusList";

export default {
  component: StatusList,
  title: "Components/Status List",
};

export const inFooter = (): JSX.Element => (
  <div>
    <StatusList>
      <li>Some item: 0%</li>
      <li>Other thing: 20</li>
    </StatusList>
  </div>
);
