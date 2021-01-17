import React from "react";
import { Beepers } from "@betaflight/api";
import { useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
import { DshotBeeperConfigDocument } from "../gql/queries/Device.graphql";
import { SetDshotBeeperConfigDocument } from "../gql/mutations/Device.graphql";
import Switch from "../components/Switch";

const REQUIRED_CONDITIONS = [Beepers.RX_SET, Beepers.RX_LOST];
const BeeperManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(DshotBeeperConfigDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setBeeperConfig, { loading: setting }] = useMutation(
    SetDshotBeeperConfigDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: DshotBeeperConfigDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const active =
    data?.connection.device.beeper.dshot.tone !== 0 &&
    REQUIRED_CONDITIONS.every(
      (required) =>
        !!data?.connection.device.beeper.dshot.conditions.includes(required)
    );

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="motor-beeper-switch">
        Motor beeper
        <Switch
          id="motor-beeper-switch"
          checked={active}
          disabled={loading || !data || setting}
          onChange={(checked) => {
            setBeeperConfig({
              variables: {
                connection: connection ?? "",
                config: checked
                  ? {
                      tone: 1,
                      conditions: REQUIRED_CONDITIONS,
                    }
                  : {
                      tone: 0,
                      conditions: [],
                    },
              },
            });
          }}
        />
      </label>
    </div>
  );
};

export default BeeperManager;
