import { useLocation } from "wouter";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Flex, Spinner, Box, Text, Set } from "bumbag";
import { gql, useMutation, useSubscription } from "../gql/apollo";
import useLogger from "../hooks/useLogger";

export const ConnectionContext = createContext("");

const ConnectionProvider: React.FC = ({ children }) => {
  const log = useLogger();
  const unmountedRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [location, setLocation] = useLocation();
  const connectionId = location.split("/connections/").pop()?.split("/")[0];

  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    [unmountedRef]
  );
  // Create a subscription to the current connection
  // and handle updating the app state when connection
  // is closed
  const { error } = useSubscription(
    gql`
      subscription OnConnectionChanged($connection: ID!) {
        onConnectionChanged(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionProvider").OnConnectionChangedSubscription,
      import("./__generated__/ConnectionProvider").OnConnectionChangedSubscriptionVariables
    >,
    {
      variables: {
        connection: connectionId ?? "",
      },
      skip: !connectionId,
      onSubscriptionData: ({ subscriptionData: { data: onChangedData } }) => {
        if (unmountedRef.current) {
          return;
        }

        const newConnectionId = onChangedData?.onConnectionChanged;
        if (newConnectionId && connectionId) {
          setLocation(location.replace(connectionId, newConnectionId));
          log(
            `Serial port reconnected for connectionId=${connectionId} newConnectionId=${newConnectionId} `
          );
        } else if (newConnectionId === null) {
          log(
            `Serial port closed unexpectedly for connectionId=${connectionId}`
          );
          setLocation("/", { replace: true });
        }
      },
    }
  );

  const [disconnect, { loading: disconnecting }] = useMutation(
    gql`
      mutation Disconnect($connection: ID!) {
        close(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionProvider").DisconnectMutation,
      import("./__generated__/ConnectionProvider").DisconnectMutationVariables
    >,
    {
      variables: {
        connection: connectionId,
      },
    }
  );

  const [disableArming] = useMutation(
    gql`
      mutation DisableArming($connection: ID!) {
        deviceSetArming(
          connectionId: $connection
          armingDisabled: true
          runawayTakeoffPreventionDisabled: false
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ConnectionProvider").DisableArmingMutation,
      import("./__generated__/ConnectionProvider").DisableArmingMutationVariables
    >,
    {
      variables: {
        connection: connectionId,
      },
      onCompleted: () => {
        log("<b>Arming disabled</b>");
        setConnected(true);
      },
      onError: async (e) => {
        log(
          `<span class="message-negative">Error disabling arming: ${e.message}</span>`
        );
        await disconnect().catch((disconnectError) => {
          log(`Error disconnecting, ${disconnectError.message}`);
        });
        setLocation("/");
      },
    }
  );

  useEffect(() => {
    if (error) {
      // Navigate away if the connection is not valid
      log("Invalid connectionId");
      setLocation("/");
    } else if (connectionId) {
      // Otherwise, disable arming for this connection
      disableArming();
    }
  }, [error, log, setLocation, disableArming, connectionId]);

  if (!connectionId || disconnecting || !connected) {
    return (
      <Flex
        width="100%"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Set>
            <Text>Configuring connection</Text>
            <Spinner size="large" />
          </Set>
        </Box>
      </Flex>
    );
  }

  return (
    <ConnectionContext.Provider value={connectionId}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
