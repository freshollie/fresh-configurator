import React from "react";
import { DisarmFlags } from "@fresh/msp";
import useSelectedPort from "../hooks/useSelectedPort";
import { useFcSummaryQuery } from "../gql/__generated__";
import Table from "../components/Table";

const ARM_SWITCH_KEY = DisarmFlags[DisarmFlags.ARM_SWITCH];

const FcSummaryProvider: React.FC = () => {
  const port = useSelectedPort();
  const { data } = useFcSummaryQuery({
    variables: {
      port: port ?? "",
    },
    pollInterval: 100,
    skip: !port,
  });

  const flagNames =
    data?.device.armingDisabledFlags
      .filter((flag) => flag !== DisarmFlags.ARM_SWITCH)
      .map((flag) => DisarmFlags[flag])
      .sort() ?? [];

  const armSwitchInactive =
    data?.device.armingDisabledFlags.includes(DisarmFlags.ARM_SWITCH) ?? false;

  return (
    <Table>
      <tbody>
        <tr>
          <td>Arming Disable Flags:</td>
          <td>
            {flagNames.map((flag) => (
              <span key={flag}>{flag}</span>
            ))}
            {armSwitchInactive && <span>{ARM_SWITCH_KEY}</span>}
          </td>
        </tr>
        <tr>
          <td>Battery voltage:</td>
          <td>{data?.device.power.voltage ?? ""} V</td>
        </tr>
        <tr>
          <td>Capacity drawn:</td>
          <td>{data?.device.power.mahDrawn ?? ""} mAh</td>
        </tr>
        <tr>
          <td>Current draw:</td>
          <td>
            {data
              ? (Math.round(data.device.power.amperage * 100) / 100).toFixed(2)
              : "0.00"}{" "}
            A
          </td>
        </tr>
        <tr>
          <td>RSSI:</td>
          <td>{data?.device.rc.rssi ?? ""}%</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default FcSummaryProvider;
