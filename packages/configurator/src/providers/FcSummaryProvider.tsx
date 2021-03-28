import React from "react";
import { DisarmFlags } from "@betaflight/api";
import { Table, Tag, Set } from "bumbag";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const ARM_SWITCH_KEY = DisarmFlags[DisarmFlags.ARM_SWITCH];

type Props = {
  refreshRate: number;
};

const FcSummaryProvider: React.FC<Props> = ({ refreshRate }) => {
  const connection = useConnection();
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
        connection,
      },
      pollInterval: 1000 / refreshRate,
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
    <Table isStriped>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Arming Disable Flags:</Table.Cell>
          <Table.Cell>
            <Set>
              {flagNames.map((flag) => (
                <Tag variant="outlined">{flag}</Tag>
              ))}
            </Set>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Battery voltage:</Table.Cell>
          <Table.Cell>
            {data?.connection.device.power.voltage ?? ""} V
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Capacity drawn:</Table.Cell>
          <Table.Cell>
            {data?.connection.device.power.mahDrawn ?? ""} mAh
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Current draw:</Table.Cell>
          <Table.Cell>
            {data
              ? (
                  Math.round(data.connection.device.power.amperage * 100) / 100
                ).toFixed(2)
              : "0.00"}{" "}
            A
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>RSSI:</Table.Cell>
          <Table.Cell>
            {data?.connection.device.rc.rssi.value ?? ""}%
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default FcSummaryProvider;
