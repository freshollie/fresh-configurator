import { useLocation } from "wouter";
import React, { createContext, useEffect } from "react";
import { gql, useSubscription } from "../gql/apollo";
import useLogger from "../hooks/useLogger";

export const ConnectionContext = createContext("");

const ConnectionProvider: React.FC = ({ children }) => {
  const log = useLogger();
  const [location, setLocation] = useLocation();
  const connectionId = location.split("/connections/").pop()?.split("/")[0];

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

  // Navigate away if the connection is not valid
  useEffect(() => {
    if (error) {
      log("Invalid connectionId");
      setLocation("/");
    }
  }, [error, log, setLocation]);

  if (!connectionId) {
    return null;
  }

  return (
    <ConnectionContext.Provider value={connectionId}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
