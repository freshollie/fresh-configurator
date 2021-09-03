import { Select } from "bumbag";
import React from "react";
import semver from "semver";
import { gql, useQuery, useMutation } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const gcd = (a: number, b: number): number => {
  if (b === 0) return a;

  return gcd(b, a % b);
};

const BlackboxSampleRateManager: React.FC = () => {
  const connection = useConnection();
  const { data } = useQuery(
    gql`
      query BlackboxSampleRatesAndPids($connection: ID!) {
        connection(connectionId: $connection) {
          apiVersion
          device {
            info {
              sampleRateHz
            }
            pid {
              protocols {
                pidProcessDenom
                gyroSyncDenom
                gyroUse32kHz
              }
            }
            blackbox {
              config {
                sampleRate
                pDenom
                rateNum
                rateDenom
              }
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxSampleRateManager").BlackboxSampleRatesAndPidsQuery,
      import("./__generated__/BlackboxSampleRateManager").BlackboxSampleRatesAndPidsQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );

  const [setBlackboxConfig, { loading: setting }] = useMutation(
    gql`
      mutation SetBlackboxConfig(
        $connection: ID!
        $config: BlackboxConfigInput!
      ) {
        deviceSetBlackboxConfig(connectionId: $connection, config: $config)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxSampleRateManager").SetBlackboxConfigMutation,
      import("./__generated__/BlackboxSampleRateManager").SetBlackboxConfigMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql`
            query BlackboxSampleRates($connection: ID!) {
              connection(connectionId: $connection) {
                device {
                  blackbox {
                    config {
                      sampleRate
                      pDenom
                      rateNum
                      rateDenom
                    }
                  }
                }
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/BlackboxSampleRateManager").BlackboxSampleRatesQuery,
            import("./__generated__/BlackboxSampleRateManager").BlackboxSampleRatesQueryVariables
          >,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  if (!data) {
    return (
      <Select disabled value="0" options={[{ label: " - ", value: "0" }]} />
    );
  }

  const { apiVersion, device } = data.connection;

  let pidRateBase = 8000;

  if (
    semver.gte(apiVersion, "1.25.0") &&
    semver.lt(apiVersion, "1.41.0") &&
    device.pid.protocols.gyroUse32kHz
  ) {
    pidRateBase = 32000;
  }

  const pidRate =
    (device.info.sampleRateHz
      ? device.info.sampleRateHz
      : pidRateBase / device.pid.protocols.gyroSyncDenom) /
    device.pid.protocols.pidProcessDenom;

  if (semver.gte(apiVersion, "1.36.0") && semver.lt(apiVersion, "1.44.0")) {
    return (
      <Select
        disabled={setting}
        value={device.blackbox.config.pDenom}
        onChange={(e) => {
          if (!connection) {
            return;
          }

          const newDenom = Number(
            (e.target as unknown as { value: string }).value
          );
          setBlackboxConfig({
            variables: {
              connection,
              config: {
                pDenom: newDenom,
              },
            },
          });
        }}
        options={[
          { label: "Disabled", hz: 0, value: 0 },
          { label: "500 Hz", hz: 500, value: 16 },
          { label: "1 kHz", hz: 1000, value: 32 },
          { label: "1.5 kHz", hz: 1500, value: 48 },
          { label: "2 kHz", hz: 2000, value: 64 },
          { label: "4 kHz", hz: 4000, value: 128 },
          { label: "8 kHz", hz: 8000, value: 256 },
          { label: "16 kHz", hz: 16000, value: 512 },
          { label: "32 kHz", hz: 32000, value: 1024 },
        ].filter(({ hz }) => pidRate >= hz || hz === 0)}
      />
    );
  }

  const legacy = semver.lt(apiVersion, "1.44.0");
  return (
    <Select
      value={device.blackbox.config.sampleRate}
      disabled={setting}
      onChange={(e) => {
        if (!connection) {
          return;
        }

        const position = Number(
          (e.target as unknown as { value: string }).value
        );
        if (legacy) {
          setBlackboxConfig({
            variables: {
              connection,
              config: {
                rateDenom: 2 ** position,
              },
            },
          });
        } else {
          setBlackboxConfig({
            variables: {
              connection,
              config: {
                sampleRate: position,
              },
            },
          });
        }
      }}
      options={new Array(legacy ? 10 : 5)
        .fill(1)
        .map((_, i) => {
          const denom = 2 ** i;
          const freq = Math.round(pidRate / 2 ** i);
          const unit = "Hz";
          return gcd(freq, 1000) === 1000
            ? {
                freq: freq / 1000,
                unit: "kHz",
                denom,
              }
            : {
                freq,
                unit,
                denom,
              };
        })
        .map(({ freq, unit, denom }, i) => ({
          value: i,
          label: `1/${denom} (${freq}${unit})`,
        }))}
    />
  );
};

export default BlackboxSampleRateManager;
