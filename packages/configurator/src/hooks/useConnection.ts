import { useContext } from "react";
import { ConnectionContext } from "../context/ConnectionProvider";

export default (): string => {
  const connection = useContext(ConnectionContext);
  if (!connection) {
    throw new Error(
      "No connection, make sure your component is wrapped in ConnectionProvider"
    );
  }

  return connection;
};
