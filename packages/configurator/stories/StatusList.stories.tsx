import React from "react";
import StatusList from "../src/components/StatusList";
import MainLayout from "../src/layouts/MainLayout";

export default {
  component: StatusList,
  title: "Components|Status List"
};

export const inFooter = (): JSX.Element => (
  <MainLayout>
    <footer>
      <StatusList>
        <li>Some item: 0%</li>
        <li>Other thing: 20</li>
      </StatusList>
    </footer>
  </MainLayout>
);
