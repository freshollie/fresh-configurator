import React from "react";
import { Sensors } from "@fresh/msp";
import Status from "../components/Status";
import Table from "../components/Table";
import { useSensorsQuery, useGpsSummaryQuery } from "../gql/__generated__";
import useConnectionState from "../hooks/useConnectionState";

const GpsSummaryProvider: React.FC = () => {
  const { connection } = useConnectionState();

  const { data: sensorsData } = useSensorsQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });
  const sensors = sensorsData?.device.sensors ?? [];

  const { data } = useGpsSummaryQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !sensors.includes(Sensors.GPS) || !connection,
    pollInterval: 100,
  });

  return (
    <Table>
      <tbody>
        <tr>
          <td>3D Fix:</td>
          <td>
            {data && (
              <Status positive={data.device.gps.fix}>
                {data.device.gps.fix ? "True" : "False"}
              </Status>
            )}
          </td>
        </tr>
        <tr>
          <td>Sats:</td>
          <td>{data?.device.gps.numSat}</td>
        </tr>
        <tr>
          <td>Latitude:</td>
          <td>{data?.device.gps.lat}</td>
        </tr>
        <tr>
          <td>Longitude:</td>
          <td>{data?.device.gps.lon}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default GpsSummaryProvider;
