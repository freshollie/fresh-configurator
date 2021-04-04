import { Box, Breadcrumb, Icon, useColorMode } from "bumbag";
import { Link as RouterLink } from "wouter";
import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "../../../gql/apollo";
import useConnection from "../../../hooks/useConnection";

const ConfigurationTopBar: React.FC<{ page?: string }> = ({
  page,
  children,
}) => {
  const connection = useConnection();
  const { colorMode } = useColorMode();

  const { data } = useQuery(
    gql`
      query PortConnections {
        ports {
          id
          connectionId
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConfigurationTopBar").PortConnectionsQuery,
      import("./__generated__/ConfigurationTopBar").PortConnectionsQueryVariables
    >
  );

  const port = data?.ports.find((p) => p.connectionId === connection)?.id;

  const items = [
    <Breadcrumb.Item>
      <RouterLink to="/">
        <Breadcrumb.Link charSet="">Home</Breadcrumb.Link>
      </RouterLink>
    </Breadcrumb.Item>,
    <Breadcrumb.Item>
      <RouterLink to={`/connections/${connection}/`}>
        <Breadcrumb.Link charSet="" isCurrent={!page}>
          {port}
        </Breadcrumb.Link>
      </RouterLink>
    </Breadcrumb.Item>,
    page && (
      <Breadcrumb.Item>
        <Breadcrumb.Link charSet="" isCurrent>
          {page}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    ),
  ].filter((elem) => !!elem);

  return (
    <Box
      position="sticky"
      top="0px"
      padding="major-2"
      zIndex="999"
      backgroundColor="default"
      border={colorMode !== "dark" ? "default" : "none"}
      borderTop="none"
      borderRight="none"
      borderLeft="none"
    >
      <Breadcrumb
        separator={
          <Icon
            icon={faChevronRight}
            type="font-awesome"
            color="gray100"
            fontSize="150"
          />
        }
      >
        {items}
      </Breadcrumb>
      {children}
    </Box>
  );
};

export default ConfigurationTopBar;
