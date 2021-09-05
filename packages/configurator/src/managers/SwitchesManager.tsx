import { Modes } from "@betaflight/api";
import { Select, OptionButtons, Box, Table, Text, Badge } from "bumbag";
import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

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
    label: "Arm",
    id: Modes.ARM,
  },
  {
    label: "Angle mode",
    id: Modes.ANGLE,
  },
  {
    label: "Horizon mode",
    id: Modes.HORIZON,
  },
  {
    label: "Beeper",
    id: Modes.BEEPER_ON,
  },
  {
    label: "Blackbox Log",
    id: Modes.BLACKBOX,
  },
  {
    label: "Turtle mode",
    id: Modes.FLIP_OVER_AFTER_CRASH,
  },
  {
    label: "GPS Rescue",
    id: Modes.GPS_RESCUE,
  },
];

const numAuxChannels = (numChannels: number): number =>
  numChannels > 4 ? numChannels - 4 : 0;

const rangeToValue = (range: Range): string | undefined =>
  RANGES.findIndex(
    ({ start, end }) => range.start === start && range.end === end
  ).toString();

const isInRange = (value: number, range: Range): boolean =>
  value > range.start && value < range.end;

const SwitchManager: React.FC<{
  slotId?: number;
  mode: Modes;
  numChannels: number;
}> = ({ slotId, numChannels, mode }) => {
  const connection = useConnection();
  const { data } = useQuery(
    gql(/* GraphQL */ `
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
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
        slotId,
      },
      skip: slotId === undefined,
    }
  );

  const [setSlotConfig, { loading: setting }] = useMutation(
    gql(/* GraphQL */ `
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
    `),
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: gql(/* GraphQL */ `
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
          `),
          variables: {
            connection,
            slotId,
          },
        },
      ],
    }
  );

  const slotData = data?.connection.device.modes.slot;
  const slotDisabled =
    data?.connection.device.modes.slot?.range.start ===
    data?.connection.device.modes.slot?.range.end;

  return (
    <>
      <Table.Cell>
        <Select
          size="small"
          disabled={!slotData || setting || slotId === undefined}
          value={
            !slotDisabled
              ? data?.connection.device.modes.slot?.auxChannel
              : "-1"
          }
          onChange={(e) => {
            if (!slotData || slotId === undefined) {
              return;
            }
            const value = Number(
              (e.target as unknown as { value: string }).value
            );

            // If the slot was previously disabled, then when the aux channel is set
            // the initial value should be mid
            const slotRangeValue = slotDisabled
              ? MID
              : {
                  start: slotData.range.start,
                  end: slotData.range.end,
                };

            setSlotConfig({
              variables: {
                connection,
                slotId,
                config: {
                  modeId: mode,
                  auxChannel: value === -1 ? 0 : value,
                  range:
                    // if set to disabled, then range has to be set to the same for start and end
                    value === -1 ? { start: 900, end: 900 } : slotRangeValue,
                },
              },
            });
          }}
          options={[
            {
              label: "Disabled",
              value: "-1",
            },
            ...new Array(numAuxChannels(numChannels))
              .fill(1)
              .map((_, auxChannel) => ({
                label: `AUX${auxChannel + 1}`,
                value: auxChannel.toString(),
              })),
          ]}
        />
      </Table.Cell>
      <Table.Cell>
        <OptionButtons
          type="checkbox"
          size="small"
          disabled={!slotData || slotDisabled}
          value={rangeToValue(
            data?.connection.device.modes.slot?.range ?? { start: 0, end: 0 }
          )}
          onChange={
            ((_: string[], value: string) => {
              if (!slotData || slotId === undefined) {
                return;
              }
              setSlotConfig({
                variables: {
                  connection,
                  slotId,
                  config: {
                    modeId: mode,
                    auxChannel: slotData.auxChannel,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    range: RANGES[Number(value)]!,
                  },
                },
              });
            }) as never
          }
          options={[
            ...RANGES.map((_, i) => ({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              label: RANGE_NAMES[i]!,
              value: i.toString(),
            })),
          ]}
        />
      </Table.Cell>
    </>
  );
};

const SwitchesManager: React.FC = () => {
  const connection = useConnection();
  const { data } = useQuery(
    gql(/* GraphQL */ `
      query ModeSlots($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            modes {
              slots {
                id
                auxChannel
                modeId
                range {
                  start
                  end
                }
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
      },
    }
  );

  const slots = data?.connection.device.modes.slots ?? [];
  const activeSlots = slots.filter(
    (slot) => slot.range.start !== slot.range.end
  );
  const firstInactiveSlot = slots.find(
    (slot) => slot.range.start === slot.range.end
  );

  const { data: channelData } = useQuery(
    gql(/* GraphQL */ `
      query RcChannels($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            rc {
              channels
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
      },
      pollInterval: activeSlots.length > 0 ? 100 : 0,
    }
  );

  const numChannels = channelData?.connection.device.rc.channels.length ?? 0;

  return (
    <Box>
      <Table variant="minimal">
        {MODES.map((mode) => {
          const slotsForMode = activeSlots.filter(
            (slot) => slot.modeId === mode.id
          );

          return (
            slotsForMode.length > 0 ? slotsForMode : [firstInactiveSlot]
          ).map((slot, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={`${mode.id} + ${i}`}>
              <Table.Cell>
                <Text>
                  <b>{mode.label}</b>
                  {slot &&
                    channelData &&
                    isInRange(
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      channelData.connection.device.rc.channels[
                        slot.auxChannel + 4
                      ]!,
                      slot.range
                    ) && (
                      <Badge
                        size="small"
                        isAttached
                        backgroundColor="warning"
                      />
                    )}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <SwitchManager
                  slotId={slot?.id}
                  numChannels={numChannels}
                  mode={mode.id}
                />
              </Table.Cell>
            </Table.Row>
          ));
        }).flat()}
      </Table>
    </Box>
  );
};

export default SwitchesManager;
