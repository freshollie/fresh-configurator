import React from "react";
import { Sensors } from "@betaflight/api";
import { Table, Tag } from "bumbag";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

type Props = {
  refreshRate: number;
};

const GpsSummaryProvider: React.FC<Props> = ({ refreshRate }) => {
  const connection = useConnection();

  const { data: sensorsData } = useQuery(
    gql`
      query AvailableSensors($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            sensors {
              available
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/GpsSummaryProvider").AvailableSensorsQuery,
      import("./__generated__/GpsSummaryProvider").AvailableSensorsQueryVariables
    >,
    {
      variables: {
        connection,
      },
    }
  );
  const sensors = sensorsData?.connection.device.sensors.available ?? [];

  const { data } = useQuery(
    gql`
      query GpsSummary($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            gps {
              fix
              numSat
              lat
              lon
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/GpsSummaryProvider").GpsSummaryQuery,
      import("./__generated__/GpsSummaryProvider").GpsSummaryQueryVariables
    >,
    {
      variables: {
        connection,
      },
      skip: !sensors.includes(Sensors.GPS),
      pollInterval: 1000 / refreshRate,
    }
  );

  return (
    <Table isStriped>
      <Table.Body>
        <Table.Row>
          <Table.Cell>3D Fix:</Table.Cell>
          <Table.Cell>
            {data && (
              <Tag
                palette={data.connection.device.gps.fix ? "success" : "danger"}
              >
                {data.connection.device.gps.fix ? "True" : "False"}
              </Tag>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Sats:</Table.Cell>
          <Table.Cell>{data?.connection.device.gps.numSat}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Latitude:</Table.Cell>
          <Table.Cell>{data?.connection.device.gps.lat}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Longitude:</Table.Cell>
          <Table.Cell>{data?.connection.device.gps.lon}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default GpsSummaryProvider;
