import React from "react";
import { isElement } from "react-is";
import { useSelectedTabQuery } from "../../gql/__generated__";

type TabElement = React.ReactElement<{ id: string }>;

/**
 * The Tab router is a component which will display any given child
 * element, with the id equal to the selected tab in the graphql state
 */
const TabRouter: React.FC = ({ children }) => {
  const { data } = useSelectedTabQuery();
  const selectedTab = data?.configurator.tab || undefined;

  const visibleTab =
    selectedTab &&
    React.Children.map(children, (c) => c)
      ?.filter(isElement)
      .filter((c): c is TabElement => typeof c.props.id === "string")
      .find((t) => t.props.id === selectedTab);

  return visibleTab || null;
};

export default TabRouter;
