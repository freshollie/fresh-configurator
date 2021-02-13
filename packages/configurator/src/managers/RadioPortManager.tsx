import { SerialPortFunctions } from "@betaflight/api";
import React from "react";
import { useMutation, useQuery } from "../gql/apollo";
import { SetSerialFunctionsDocument } from "../gql/mutations/Device.graphql";
import { DevicePortFunctionsDocument } from "../gql/queries/Device.graphql";
import useConnectionState from "../hooks/useConnectionState";

const RadioPortManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(DevicePortFunctionsDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setFunctions, { loading: setting }] = useMutation(
    SetSerialFunctionsDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: DevicePortFunctionsDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );
  const portFunctions = data?.connection.device.serial.ports ?? [];
  const currentPort = portFunctions.find(({ functions }) =>
    functions.includes(SerialPortFunctions.RX_SERIAL)
  )?.id;

  return (
    <label htmlFor="radio-port">
      Reciever port
      <select
        id="radio-port"
        disabled={!data || loading || setting}
        value={currentPort ?? -1}
        onChange={(e) => {
          const newPort = e.target.value;
          setFunctions({
            variables: {
              portFunctions: portFunctions.map(({ id, functions }) => ({
                id,
                functions: functions
                  .filter((fun) => fun !== SerialPortFunctions.RX_SERIAL)
                  .concat(
                    id.toString() === newPort
                      ? [SerialPortFunctions.RX_SERIAL]
                      : []
                  ),
              })),
              connection: connection ?? "",
            },
          });
        }}
      >
        <option value={-1}>None</option>
        {portFunctions
          // Obviously not possible to set the receiver port to the current MSP port
          .filter(
            ({ functions }) => !functions.includes(SerialPortFunctions.MSP)
          )
          .map(({ id }) => (
            <option value={id} key={id}>
              UART{id + 1}
            </option>
          ))}
      </select>
    </label>
  );
};

export default RadioPortManager;
