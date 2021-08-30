import { Box, Breadcrumb, Icon, useColorMode, Image, Set } from "bumbag";
import { Link as RouterLink } from "wouter";
import React, { useEffect } from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "../../../gql/apollo";
import useConnection from "../../../hooks/useConnection";
import { SupaflyLogo } from "../../../logos";

const ConfigurationTopBar: React.FC<{ page?: string }> = ({
  page,
  children,
}) => {
  const connection = useConnection();
  const { colorMode } = useColorMode();

  const { data, refetch } = useQuery(
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

  // Refetch the list of ports if the connection id changes
  useEffect(() => {
    refetch();
  }, [connection, refetch]);

  const port = data?.ports.find((p) => p.connectionId === connection)?.id;

  const items = [
    <Breadcrumb.Item>
      <RouterLink to="/">
        <Breadcrumb.Link color="black">Home</Breadcrumb.Link>
      </RouterLink>
    </Breadcrumb.Item>,
    <Breadcrumb.Item>
      <RouterLink to={`/connections/${connection}/`}>
        <Breadcrumb.Link color="black" isCurrent={!page}>
          {port}
        </Breadcrumb.Link>
      </RouterLink>
    </Breadcrumb.Item>,
    page && (
      <Breadcrumb.Item>
        <Breadcrumb.Link color="black" isCurrent>
          {page}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    ),
  ].filter(Boolean);

  return (
    <Box
      position="sticky"
      top="0px"
      // TODO: fix type once bumbag works with numbers as expected
      zIndex={"999" as never}
      backgroundColor="default"
      border={colorMode !== "dark" ? "default" : "none"}
      borderTop="none"
      borderRight="none"
      borderLeft="none"
    >
      <Box backgroundColor="warning" padding="major-1">
        <Set orientation="horizontal">
          <Image
            loading="eager"
            referrerPolicy=""
            src={SupaflyLogo}
            height="30px"
          />
          <Breadcrumb
            separator={
              <Icon
                icon={faChevronRight}
                type="font-awesome"
                color="black"
                fontSize="150"
              />
            }
          >
            {items}
          </Breadcrumb>
        </Set>
      </Box>
      {children && <Box padding="major-2">{children}</Box>}
    </Box>
  );
};

export default ConfigurationTopBar;
