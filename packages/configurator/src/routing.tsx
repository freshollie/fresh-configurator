/* eslint-disable import/prefer-default-export */
import React from "react";
import { isElement } from "react-is";
import { useQuery } from "./gql/apollo";
import { SelectedTabDocument } from "./gql/queries/Configurator.graphql";

type TabElement = React.ReactElement<{ id: string }>;

/**
 * The Tab router is a component which will display any given child
 * element, with the id equal to the selected tab in the graphql state
 */
export const TabRouter: React.FC<{ children: TabElement | TabElement[] }> = ({
  children,
}) => {
  const { data } = useQuery(SelectedTabDocument);
  const selectedTab = data?.configurator.tab ?? undefined;

  const visibleTab =
    (selectedTab &&
      React.Children.map(children, (c) => c)
        .filter(isElement)
        .filter((c): c is TabElement => typeof c.props.id === "string")
        .find((t) => t.props.id === selectedTab)) ||
    undefined;

  return visibleTab ?? null;
};
