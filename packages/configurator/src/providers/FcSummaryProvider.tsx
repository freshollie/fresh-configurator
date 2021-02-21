import React from "react";
import { DisarmFlags } from "@betaflight/api";
import Table from "../components/Table";
import useConnectionState from "../hooks/useConnectionState";
import { gql, useQuery } from "../gql/apollo";

const ARM_SWITCH_KEY = DisarmFlags[DisarmFlags.ARM_SWITCH];

type Props = {
  refreshRate: number;
};

const FcSummaryProvider: React.FC<Props> = ({ refreshRate }) => {
  const { connection } = useConnectionState();
  const { data } = useQuery(
    gql`
      query FcSummary($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            arming {
              disabledFlags
            }
            power {
              voltage
              mahDrawn
              amperage
            }
            rc {
              rssi {
                value
              }
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/FcSummaryProvider").FcSummaryQuery,
      import("./__generated__/FcSummaryProvider").FcSummaryQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      pollInterval: 1000 / refreshRate,
      skip: !connection,
    }
  );

  const flagNames =
    data?.connection.device.arming.disabledFlags
      .filter((flag) => flag !== DisarmFlags.ARM_SWITCH)
      .map((flag) => DisarmFlags[flag])
      .sort()
      .concat(
        data.connection.device.arming.disabledFlags.includes(
          DisarmFlags.ARM_SWITCH
        )
          ? [ARM_SWITCH_KEY]
          : []
      ) ?? [];

  return (
    <Table>
      <tbody>
        <tr>
          <td>Arming Disable Flags:</td>
          <td>{flagNames.join(" ")}</td>
        </tr>
        <tr>
          <td>Battery voltage:</td>
          <td>{data?.connection.device.power.voltage ?? ""} V</td>
        </tr>
        <tr>
          <td>Capacity drawn:</td>
          <td>{data?.connection.device.power.mahDrawn ?? ""} mAh</td>
        </tr>
        <tr>
          <td>Current draw:</td>
          <td>
            {data
              ? (
                  Math.round(data.connection.device.power.amperage * 100) / 100
                ).toFixed(2)
              : "0.00"}{" "}
            A
          </td>
        </tr>
        <tr>
          <td>RSSI:</td>
          <td>{data?.connection.device.rc.rssi.value ?? ""}%</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default FcSummaryProvider;
