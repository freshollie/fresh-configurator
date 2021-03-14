/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import semver from "semver";
import { gql, useQuery, useMutation } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";

const gcd = (a: number, b: number): number => {
  if (b === 0) return a;

  return gcd(b, a % b);
};

const BlackboxSampleRateManager: React.FC = () => {
  const { connection } = useConnectionState();
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
    return <select disabled />;
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
      <select
        disabled={setting}
        value={device.blackbox.config.pDenom}
        onChange={(e) => {
          if (!connection) {
            return;
          }

          const newDenom = Number(e.target.value);
          setBlackboxConfig({
            variables: {
              connection,
              config: {
                pDenom: newDenom,
              },
            },
          });
        }}
      >
        {[
          { text: "Disabled", hz: 0, pDenom: 0 },
          { text: "500 Hz", hz: 500, pDenom: 16 },
          { text: "1 kHz", hz: 1000, pDenom: 32 },
          { text: "1.5 kHz", hz: 1500, pDenom: 48 },
          { text: "2 kHz", hz: 2000, pDenom: 64 },
          { text: "4 kHz", hz: 4000, pDenom: 128 },
          { text: "8 kHz", hz: 8000, pDenom: 256 },
          { text: "16 kHz", hz: 16000, pDenom: 512 },
          { text: "32 kHz", hz: 32000, pDenom: 1024 },
        ]
          .filter(({ hz }) => pidRate >= hz || hz === 0)
          .map(({ text, pDenom }) => (
            <option key={pDenom} value={pDenom}>
              {text}
            </option>
          ))}
      </select>
    );
  }

  const legacy = semver.lt(apiVersion, "1.44.0");
  return (
    <select
      value={device.blackbox.config.sampleRate}
      disabled={setting}
      onChange={(e) => {
        if (!connection) {
          return;
        }

        const position = Number(e.target.value);
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
    >
      {new Array(legacy ? 10 : 5)
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
        .map(({ freq, unit, denom }, i) => (
          <option key={freq} value={i}>
            1/{denom} ({freq}
            {unit})
          </option>
        ))}
    </select>
  );
};

export default BlackboxSampleRateManager;
