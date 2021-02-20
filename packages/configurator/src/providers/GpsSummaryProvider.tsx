import React from "react";
import { Sensors } from "@betaflight/api";
import Status from "../components/Status";
import Table from "../components/Table";
import useConnectionState from "../hooks/useConnectionState";
import { gql, useQuery } from "../gql/apollo";

type Props = {
  refreshRate: number;
};

const GpsSummaryProvider: React.FC<Props> = ({ refreshRate }) => {
  const { connection } = useConnectionState();

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
        connection: connection ?? "",
      },
      skip: !connection,
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
        connection: connection ?? "",
      },
      skip: !sensors.includes(Sensors.GPS) || !connection,
      pollInterval: 1000 / refreshRate,
    }
  );

  return (
    <Table>
      <tbody>
        <tr>
          <td>3D Fix:</td>
          <td>
            {data && (
              <Status positive={data.connection.device.gps.fix}>
                {data.connection.device.gps.fix ? "True" : "False"}
              </Status>
            )}
          </td>
        </tr>
        <tr>
          <td>Sats:</td>
          <td>{data?.connection.device.gps.numSat}</td>
        </tr>
        <tr>
          <td>Latitude:</td>
          <td>{data?.connection.device.gps.lat}</td>
        </tr>
        <tr>
          <td>Longitude:</td>
          <td>{data?.connection.device.gps.lon}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default GpsSummaryProvider;
