import { useContext } from "react";
import { ConnectionContext } from "../context/ConnectionProvider";

export default (): string => useContext(ConnectionContext);
