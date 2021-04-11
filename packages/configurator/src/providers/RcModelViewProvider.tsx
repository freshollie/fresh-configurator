import React from "react";
import semver from "semver";
import Model from "../components/Model";
import useSimulatedAttitude from "../hooks/useSimulatedAttitude";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const RcModelViewProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const connection = useConnection();
  const { data } = useQuery(
    gql`
      query RcModelViewData($connection: ID!) {
        connection(connectionId: $connection) {
          apiVersion
          device {
            rc {
              tuning {
                rcRate
                rcExpo
                rollPitchRate
                pitchRate
                rollRate
                yawRate
                dynamicThrottlePid
                throttleMid
                throttleExpo
                dynamicThrottleBreakpoint
                rcYawExpo
                rcYawRate
                rcPitchRate
                rcPitchExpo
                throttleLimitType
                throttleLimitPercent
                rollRateLimit
                pitchRateLimit
                yawRateLimit
              }
              deadband {
                deadband
                yawDeadband
              }
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/RcModelViewProvider").RcModelViewDataQuery,
      import("./__generated__/RcModelViewProvider").RcModelViewDataQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );

  const apiVersion = data?.connection.apiVersion ?? "0.0.0";

  const { data: channelsData } = useQuery(
    gql`
      query RcChannels($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            rc {
              channels
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/RcModelViewProvider").RcChannelsQuery,
      import("./__generated__/RcModelViewProvider").RcChannelsQueryVariables
    >,
    {
      variables: {
        connection,
      },
      pollInterval: 1000 / refreshRate,
    }
  );

  const attitude = useSimulatedAttitude(
    channelsData?.connection.device.rc.channels,
    data?.connection.device.rc.tuning,
    data?.connection.device.rc.deadband,
    semver.lte(apiVersion, "1.20.0")
  );

  return <Model name="quadx" attitude={attitude} />;
};

export default RcModelViewProvider;
