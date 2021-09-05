import {
  EscProtocols,
  mcuGroupFromId,
  MCU_GROUPS,
  McuTypes,
} from "@betaflight/api";
import React from "react";
import { Box, Text, Button, Alert } from "bumbag";
import { useMutation, useQuery, gql } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

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

const PidProtocolsAndProcessor = gql(/* GraphQL */ `
  query PidProtocolsAndProcessor($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        pid {
          protocols {
            gyroSyncDenom
            pidProcessDenom
            fastPwmProtocol
            useUnsyncedPwm
            motorPwmRate
          }
        }
        info {
          targetName
          mcuTypeId
        }
      }
    }
  }
`);

const CpuDefaultsManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading, error } = useQuery(PidProtocolsAndProcessor, {
    variables: {
      connection,
    },
  });

  const [setProtocols, { loading: saving }] = useMutation(
    gql(/* GraphQL */ `
      mutation SetPidProtocols(
        $connection: ID!
        $protocols: PidProtocolsInput!
      ) {
        deviceSetPidProtocols(connectionId: $connection, protocols: $protocols)
      }
    `),
    {
      refetchQueries: [
        {
          query: PidProtocolsAndProcessor,
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
    <Box>
      {loading && <Text>Retrieving CPU data</Text>}
      {error && <Text>Error loading CPU data</Text>}
      {expectedConfig &&
        data &&
        !isEqual(expectedConfig, data.connection.device.pid.protocols) && (
          <Alert type="warning" variant="bordered">
            <Text>
              We have detected your CPU as <b>{processorType}</b> and can apply
              some settings for best performance
            </Text>
            <Box>
              <Button
                size="small"
                isLoading={saving}
                onClick={() => {
                  setProtocols({
                    variables: {
                      connection,
                      protocols: expectedConfig,
                    },
                  });
                }}
              >
                Apply
              </Button>
            </Box>
          </Alert>
        )}
      {expectedConfig &&
        data &&
        isEqual(expectedConfig, data.connection.device.pid.protocols) && (
          <Text>
            Recommended settings already applied for your CPU (
            <b>{processorType}</b>)
          </Text>
        )}
      {data && !expectedConfig && processorType && (
        <Text>
          Your detected CPU type (<b>{processorType}</b>) is unsupported.
          However, you can still apply settings based on the CPU types below
        </Text>
      )}
      {data && !processorType && <div>Could not detect processor type</div>}
      {!expectedConfig && !loading && (
        <Box>
          <Button
            disabled={saving || f7Applied}
            onClick={() => {
              setProtocols({
                variables: {
                  connection,
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
                  connection,
                  protocols: recommenedProtocols.F4,
                },
              });
            }}
          >
            {!f4Applied ? "Apply F4 settings" : "F4 settings applied"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CpuDefaultsManager;
