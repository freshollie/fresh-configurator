import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Modes } from "@betaflight/api";
import React from "react";
import { ConnectionContext } from "../src/context/ConnectionProvider";
import { gql } from "../src/gql/apollo";
import SwitchesManager from "../src/managers/SwitchesManager";

export default {
  title: "Managers/Switches",
  component: SwitchesManager,
};

const modesResponse = (connection: string): MockedResponse => ({
  request: {
    query: gql`
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
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager.stories").ModeSlotsQuery,
      import("./__generated__/SwitchesManager.stories").ModeSlotsQueryVariables
    >,
    variables: {
      connection,
    },
  },
  result: {
    data: {
      connection: {
        device: {
          modes: {
            slots: [
              {
                __typename: "ModeSlot",
                id: 0,
                auxChannel: 1,
                modeId: Modes.ANGLE,
                range: {
                  start: 900,
                  end: 2100,
                },
              },
            ],
          },
        },
      },
    },
  },
});

const modeResponse = (connection: string, slotId: number): MockedResponse => ({
  request: {
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
              }
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SwitchesManager.stories").ModeSlotQuery,
      import("./__generated__/SwitchesManager.stories").ModeSlotQueryVariables
    >,
    variables: {
      connection,
      slotId,
    },
  },
  result: {
    data: {
      connection: {
        device: {
          modes: {
            slot: {
              __typename: "ModeSlot",
              id: "0",
              auxChannel: 1,
              modeId: Modes.ANGLE,
              range: {
                start: 900,
                end: 2100,
              },
            },
          },
        },
      },
    },
  },
});

const channelsResponse = (connection: string): MockedResponse => ({
  request: {
    query: gql`
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
      import("./__generated__/SwitchesManager.stories").RcChannelsQuery,
      import("./__generated__/SwitchesManager.stories").RcChannelsQueryVariables
    >,
    variables: {
      connection,
    },
  },
  result: {
    data: {
      connection: {
        device: {
          rc: {
            channels: new Array(14).fill(2000),
          },
        },
      },
    },
  },
});

export const airModeSet: React.FC = () => (
  <MockedProvider
    mocks={[
      modesResponse("abc"),
      modeResponse("abc", 0),
      channelsResponse("abc"),
    ]}
  >
    <ConnectionContext.Provider value="abc">
      <SwitchesManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);
