import React from "react";
import {
  RcSmoothingTypes,
  SerialPortFunctions,
  SerialRxProviders,
} from "@betaflight/api";
import { useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
import {
  RadioProtocolManagerDataDocument,
  SetReceiverProtocolAndSmoothingDataDocument,
} from "./RadioProtocolManager.graphql";
import { DeviceSerialPortFunctionsDocument } from "../gql/queries/Device.graphql";

const PROVIDERS = [
  {
    name: "FrSky",
    value: SerialRxProviders.SBUS,
  },
  { name: "FlySky", value: SerialRxProviders.IBUS },
  { name: "CrossFire", value: SerialRxProviders.CRSF },
];

const RadioProtocolManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data: serialConfigData } = useQuery(
    DeviceSerialPortFunctionsDocument,
    {
      variables: {
        connection: connection ?? "",
      },
    }
  );
  const { data, loading } = useQuery(RadioProtocolManagerDataDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });
  const [setReceiverConfig, { loading: setting }] = useMutation(
    SetReceiverProtocolAndSmoothingDataDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: RadioProtocolManagerDataDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const hasSerialPortSet = !!serialConfigData?.connection.device.serial.ports.find(
    ({ functions }) => functions.includes(SerialPortFunctions.RX_SERIAL)
  );
  const selectedProtocol =
    data?.connection.device.rc.receiver.serialProvider ?? -1;

  const smoothingSet =
    data?.connection.device.rc.smoothing.type ===
    RcSmoothingTypes.INTERPOLATION;

  return hasSerialPortSet ? (
    <div>
      <label htmlFor="receiver-type-selector">
        Radio Protocol
        <select
          disabled={loading || setting}
          // Make out that the protocol needs to be set if
          // the smoothing is not set
          value={smoothingSet ? selectedProtocol : -1}
          id="receiver-type-selector"
          onChange={(e) => {
            const serialProvider = Number(e.target.value);
            setReceiverConfig({
              variables: {
                connection: connection ?? "",
                serialProvider,
                smoothingType: RcSmoothingTypes.INTERPOLATION,
              },
            });
          }}
        >
          <option value={-1} hidden>
            Select protocol
          </option>
          {PROVIDERS.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </label>
    </div>
  ) : null;
};

export default RadioProtocolManager;
