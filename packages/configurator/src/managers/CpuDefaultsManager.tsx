import {
  EscProtocols,
  mcuGroupFromId,
  MCU_GROUPS,
  McuTypes,
} from "@betaflight/api";
import React from "react";
import { PidProtocolsAndProcessorDocument } from "../gql/queries/Device.graphql";
import { SetPidProtocolsDocument } from "../gql/mutations/Device.graphql";
import useConnectionState from "../hooks/useConnectionState";
import Button from "../components/Button";
import { useMutation, useQuery } from "../gql/apollo";

type McuGroupName = keyof typeof MCU_GROUPS;
const MCU_GROUP_NAMES = Object.keys(MCU_GROUPS) as McuGroupName[];

const isEqual = (
  reference: Record<string, unknown>,
  value: Record<string, unknown>
): boolean =>
  Object.keys(reference).every((key) => reference[key] === value[key]);

const recommenedProtocols = {
  F7: {
    motorPwmRate: 0,
    useUnsyncedPwm: false,
    fastPwmProtocol: EscProtocols.DSHOT600,
    pidProcessDenom: 8,
    gyroSyncDenom: 8,
  },
  H7: {
    motorPwmRate: 0,
    useUnsyncedPwm: false,
    fastPwmProtocol: EscProtocols.DSHOT600,
    pidProcessDenom: 8,
    gyroSyncDenom: 8,
  },
  F4: {
    motorPwmRate: 0,
    useUnsyncedPwm: false,
    fastPwmProtocol: EscProtocols.DSHOT300,
    pidProcessDenom: 4,
    gyroSyncDenom: 8,
  },
  F1: undefined,
  F3: undefined,
};

const findProcessorType = ({
  mcuTypeId,
  targetName,
}: {
  mcuTypeId: McuTypes;
  targetName: string;
}): McuGroupName | undefined =>
  mcuGroupFromId(mcuTypeId) ??
  MCU_GROUP_NAMES.find((name) =>
    targetName.toLocaleLowerCase().includes(name.toLowerCase())
  );

const CpuDefaultsManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading, error } = useQuery(PidProtocolsAndProcessorDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setProtocols, { loading: saving }] = useMutation(
    SetPidProtocolsDocument,
    {
      refetchQueries: [
        {
          query: PidProtocolsAndProcessorDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const processorType = data?.connection.device.info
    ? findProcessorType(data.connection.device.info)
    : undefined;

  const expectedConfig = processorType
    ? recommenedProtocols[processorType]
    : undefined;

  const f4Applied =
    data &&
    isEqual(recommenedProtocols.F4, data.connection.device.pid.protocols);
  const f7Applied =
    data &&
    isEqual(recommenedProtocols.F7, data.connection.device.pid.protocols);

  return (
    <div>
      {loading && <span>Retrieving CPU data</span>}
      {error && <span>Error loading CPU data</span>}
      {expectedConfig &&
        data &&
        !isEqual(expectedConfig, data.connection.device.pid.protocols) && (
          <div>
            <div>
              We have detected your CPU as <b>{processorType}</b> and can apply
              some settings for best performance
            </div>
            <Button
              disabled={saving}
              onClick={() => {
                setProtocols({
                  variables: {
                    connection: connection ?? "",
                    protocols: expectedConfig,
                  },
                });
              }}
            >
              Apply
            </Button>
          </div>
        )}
      {expectedConfig &&
        data &&
        isEqual(expectedConfig, data.connection.device.pid.protocols) && (
          <div>
            Recommended settings already applied for your CPU (
            <b>{processorType}</b>)
          </div>
        )}
      {data && !expectedConfig && processorType && (
        <div>
          Your detected CPU type (<b>{processorType}</b>) is unsupported.
          However, you can still apply settings based on the CPU types below
        </div>
      )}
      {data && !processorType && <div>Could not detect processor type</div>}
      {!expectedConfig && !loading && (
        <>
          <Button
            disabled={saving || f7Applied}
            onClick={() => {
              setProtocols({
                variables: {
                  connection: connection ?? "",
                  protocols: recommenedProtocols.F7,
                },
              });
            }}
          >
            {!f7Applied ? "Apply F7/H7 settings" : "F7/H7 settings applied"}
          </Button>
          <Button
            disabled={saving || f4Applied}
            onClick={() => {
              setProtocols({
                variables: {
                  connection: connection ?? "",
                  protocols: recommenedProtocols.F4,
                },
              });
            }}
          >
            {!f4Applied ? "Apply F4 settings" : "F4 settings applied"}
          </Button>
        </>
      )}
    </div>
  );
};

export default CpuDefaultsManager;
