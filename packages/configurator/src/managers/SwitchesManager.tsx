import { Modes } from "@betaflight/api";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
import styled from "../theme";

type Range = {
  start: number;
  end: number;
};

const LOW = { start: 900, end: 1300 };
const MID = { start: 1300, end: 1700 };
const HIGH = { start: 1700, end: 2100 };
const RANGES = [LOW, MID, HIGH] as const;

const RANGE_NAMES: Record<number, string> = {
  0: "Low",
  1: "Mid",
  2: "High",
};

const MODES = [
  {
    text: "Arm",
    value: Modes.ARM,
  },
  {
    text: "Angle mode",
    value: Modes.ANGLE,
  },
  {
    text: "Horizon mode",
    value: Modes.HORIZON,
  },
  {
    text: "Beeper",
    value: Modes.BEEPER_ON,
  },
  {
    text: "Blackbox Log",
    value: Modes.BLACKBOX,
  },
  {
    text: "Turtle mode",
    value: Modes.FLIP_OVER_AFTER_CRASH,
  },
  {
    text: "GPS Rescue",
    value: Modes.GPS_RESCUE,
  },
];

const numAuxChannels = (numChannels: number): number =>
  numChannels > 4 ? numChannels - 4 : 0;

const rangeToIndex = (range: Range): number | undefined =>
  RANGES.findIndex(
    ({ start, end }) => range.start === start && range.end === end
  );

const isInRange = (value: number, range: Range): boolean =>
  value > range.start && value < range.end;

const SwitchManager: React.FC<{ slotId: number }> = ({ slotId }) => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(
    gql`
      query ModeSlotAndChannels($connection: ID!, $slotId: Int!) {
        connection(connectionId: $connection) {
          device {
            modes {
              slot(id: $slotId) {
                id
                range {
                  start
                  end
                }
                auxChannel
                modeId
              }
            }
            rc {
              channels
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager").ModeSlotAndChannelsQuery,
      import("./__generated__/SwitchesManager").ModeSlotAndChannelsQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
        slotId,
      },
      skip: !connection,
    }
  );

  const [setSlotConfig, { loading: setting }] = useMutation(
    gql`
      mutation SetModeSlotConfig(
        $connection: ID!
        $slotId: Int!
        $config: ModeSlotConfig!
      ) {
        deviceSetModeSlotConfig(
          connectionId: $connection
          slotId: $slotId
          config: $config
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager").SetModeSlotConfigMutation,
      import("./__generated__/SwitchesManager").SetModeSlotConfigMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql`
            query ModeSlot($connection: ID!, $slotId: Int!) {
              connection(connectionId: $connection) {
                device {
                  modes {
                    slot(id: $slotId) {
                      id
                      range {
                        start
                        end
                      }
                      auxChannel
                      modeId
                    }
                  }
                }
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/SwitchesManager").ModeSlotQuery,
            import("./__generated__/SwitchesManager").ModeSlotQueryVariables
          >,
          variables: {
            connection,
            slotId,
          },
        },
      ],
    }
  );

  const slotData = data?.connection.device.modes.slot;

  return (
    <span>
      <select
        disabled={loading || setting}
        value={data?.connection.device.modes.slot?.modeId}
        onChange={(e) => {
          if (!slotData) {
            return;
          }
          setSlotConfig({
            variables: {
              connection: connection ?? "",
              slotId,
              config: {
                modeId: Number(e.target.value),
                auxChannel: slotData.auxChannel,
                range: {
                  start: slotData.range.start,
                  end: slotData.range.end,
                },
              },
            },
          });
        }}
      >
        <option hidden>Select mode</option>
        {MODES.map(({ text, value }) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      when
      <select
        disabled={loading || setting}
        value={rangeToIndex(
          data?.connection.device.modes.slot?.range ?? { start: 0, end: 0 }
        )}
        onChange={(e) => {
          if (!slotData) {
            return;
          }
          setSlotConfig({
            variables: {
              connection: connection ?? "",
              slotId,
              config: {
                modeId: slotData.modeId,
                auxChannel: slotData.auxChannel,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                range: RANGES[Number(e.target.value)]!,
              },
            },
          });
        }}
      >
        <option hidden>Select position</option>
        {RANGES.map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={i} value={i}>
            {RANGE_NAMES[i]}
          </option>
        ))}
      </select>
    </span>
  );
};

const RemoveRowButton = styled.span`
  display: none;
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
`;

const SlotWrapper = styled.div<{ highlighted: boolean }>`
  background-color: ${({ highlighted }) =>
    highlighted ? "yellow" : "initial"};
  &:hover {
    ${RemoveRowButton} {
      display: initial;
    }
  }
`;

const ModeSlots = gql`
  query ModeSlots($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        modes {
          slots {
            id
            auxChannel
            range {
              start
              end
            }
          }
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/SwitchesManager").ModeSlotsQuery,
  import("./__generated__/SwitchesManager").ModeSlotsQueryVariables
>;

const SwitchesManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(ModeSlots, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const slots = data?.connection.device.modes.slots ?? [];
  const activeSlots = slots.filter(
    (slot) => slot.range.start !== slot.range.end
  );
  const firstInactiveSlot = slots.find(
    (slot) => slot.range.start === slot.range.end
  );
  const maxSlots = slots.length;

  const { data: channelData, loading: loadingChannels } = useQuery(
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
      import("./__generated__/SwitchesManager").RcChannelsQuery,
      import("./__generated__/SwitchesManager").RcChannelsQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      skip: !connection,
      pollInterval: activeSlots.length > 0 ? 100 : 0,
    }
  );

  const [activateSlot, { loading: activatingSlot }] = useMutation(
    gql`
      mutation ActivateModeSlot(
        $connection: ID!
        $slotId: Int!
        $auxChannel: Int!
      ) {
        deviceSetModeSlotConfig(
          connectionId: $connection
          slotId: $slotId
          config: {
            auxChannel: $auxChannel
            modeId: 0
            range: { start: 900, end: 1300 }
          }
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager").ActivateModeSlotMutation,
      import("./__generated__/SwitchesManager").ActivateModeSlotMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ModeSlots,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const [deactivateModeSlot] = useMutation(
    gql`
      mutation DeactivateModeSwitch($connection: ID!, $slotId: Int!) {
        deviceSetModeSlotConfig(
          connectionId: $connection
          slotId: $slotId
          config: { auxChannel: 0, modeId: 0, range: { start: 900, end: 900 } }
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager").DeactivateModeSwitchMutation,
      import("./__generated__/SwitchesManager").DeactivateModeSwitchMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ModeSlots,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const numChannels = channelData?.connection.device.rc.channels.length ?? 0;

  return (
    <div>
      <div>New switch</div>
      <select
        value={-1}
        disabled={
          activatingSlot || loadingChannels || activeSlots.length === maxSlots
        }
        onChange={(e) => {
          if (!firstInactiveSlot) {
            return;
          }
          activateSlot({
            variables: {
              connection: connection ?? "",
              auxChannel: Number(e.target.value),
              slotId: firstInactiveSlot.id,
            },
          });
        }}
      >
        <option value={-1} hidden>
          Select aux channel
        </option>
        {new Array(numAuxChannels(numChannels)).fill(1).map((_, auxChannel) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={auxChannel} value={auxChannel}>
            AUX{auxChannel + 1}
          </option>
        ))}
      </select>

      {loading && <div>Loading mode switches</div>}
      {new Array(numAuxChannels(numChannels)).fill(0).map((_, channel) => {
        const channelSlots = activeSlots.filter(
          ({ auxChannel }) => auxChannel === channel
        );
        return (
          channelSlots.length > 0 && (
            // eslint-disable-next-line react/no-array-index-key
            <div key={channel}>
              <h4>AUX{channel + 1}</h4>
              {channelSlots.map((slot) => (
                <SlotWrapper
                  key={slot.id}
                  highlighted={
                    !!(
                      channelData &&
                      isInRange(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        channelData.connection.device.rc.channels[
                          slot.auxChannel + 4
                        ]!,
                        slot.range
                      )
                    )
                  }
                >
                  <SwitchManager slotId={slot.id} />
                  <RemoveRowButton
                    onClick={() => {
                      deactivateModeSlot({
                        variables: {
                          connection: connection ?? "",
                          slotId: slot.id,
                        },
                      });
                    }}
                  >
                    x
                  </RemoveRowButton>
                </SlotWrapper>
              ))}
            </div>
          )
        );
      })}
    </div>
  );
};

export default SwitchesManager;
