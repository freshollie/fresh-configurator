import {
  OSDAlarms,
  OSDFields,
  OSDStatisticFields,
  OSDTimerSources,
  OSDUnitTypes,
  OSDVideoTypes,
  OSDWarnings,
} from "@betaflight/api";
import gql from "graphql-tag";
import { add } from "../../src/connections";
import { mockApi } from "../mocks";
import { createExecutor } from "../utils";

const client = createExecutor();

const OSD_CONFIG = {
  alarms: [
    {
      key: OSDAlarms.CAP,
      value: 25,
    },
    {
      key: OSDAlarms.TIME,
      value: 2200,
    },
    {
      key: OSDAlarms.ALT,
      value: 100,
    },
  ],
  displayItems: [
    {
      key: OSDFields.MAH_DRAWN,
      position: {
        x: 10,
        y: 7,
      },
      visibilityProfiles: [false, true, false],
    },
    {
      key: OSDFields.RC_CHANNELS,
      position: {
        x: 22,
        y: 11,
      },
      visibilityProfiles: [true, false, false],
    },
  ],
  flags: {
    hasOSD: true,
    haveMax7456Video: true,
    haveOsdFeature: true,
    isMax7456Detected: true,
    isOsdSlave: false,
  },
  osdProfiles: {
    count: 3,
    selected: 2,
  },
  parameters: {
    cameraFrameHeight: 11,
    cameraFrameWidth: 24,
    overlayRadioMode: 2,
  },
  statisticItems: [
    {
      enabled: true,
      key: OSDStatisticFields.MAX_CURRENT,
    },
    {
      enabled: false,
      key: OSDStatisticFields.MAX_FFT,
    },
  ],
  timers: [
    {
      key: 0,
      precision: 0,
      src: OSDTimerSources.ON_ARM_TIME,
      time: 10,
    },
    {
      key: 1,
      precision: 0,
      src: OSDTimerSources.TOTAL_ARMED_TIME,
      time: 10,
    },
  ],
  unitMode: OSDUnitTypes.METRIC,
  videoSystem: OSDVideoTypes.NTSC,
  warnings: [
    {
      enabled: true,
      key: OSDWarnings.CORE_TEMPERATURE,
    },
    {
      enabled: true,
      key: OSDWarnings.FAILSAFE,
    },
  ],
};

describe("device.osd", () => {
  it("should return the osd config", async () => {
    add("/dev/someport", "connection-123");

    mockApi.readOSDConfig.mockResolvedValue(OSD_CONFIG);

    const { data, errors } = await client.query({
      query: gql`
        query {
          connection(connectionId: "connection-123") {
            device {
              osd {
                flags {
                  hasOSD
                  haveMax7456Video
                  isMax7456Detected
                  haveOsdFeature
                  isOsdSlave
                }
                unitMode
                displayItems {
                  id
                  position {
                    x
                    y
                  }
                  visibilityProfiles
                }
                statisticItems {
                  enabled
                  id
                }
                warnings {
                  enabled
                  id
                }
                timers {
                  id
                  precision
                  src
                  time
                }
                videoSystem
                alarms {
                  id
                  value
                }
                parameters {
                  cameraFrameHeight
                  cameraFrameWidth
                  overlayRadioMode
                }
                osdProfiles {
                  count
                  selected
                }
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.osd).toEqual({
      alarms: [
        {
          id: OSDAlarms.CAP,
          value: 25,
        },
        {
          id: OSDAlarms.TIME,
          value: 2200,
        },
        {
          id: OSDAlarms.ALT,
          value: 100,
        },
      ],
      displayItems: [
        {
          id: OSDFields.MAH_DRAWN,
          position: {
            x: 10,
            y: 7,
          },
          visibilityProfiles: [false, true, false],
        },
        {
          id: OSDFields.RC_CHANNELS,
          position: {
            x: 22,
            y: 11,
          },
          visibilityProfiles: [true, false, false],
        },
      ],
      flags: {
        hasOSD: true,
        haveMax7456Video: true,
        haveOsdFeature: true,
        isMax7456Detected: true,
        isOsdSlave: false,
      },
      parameters: {
        cameraFrameHeight: 11,
        cameraFrameWidth: 24,
        overlayRadioMode: 2,
      },
      statisticItems: [
        {
          enabled: true,
          id: OSDStatisticFields.MAX_CURRENT,
        },
        {
          enabled: false,
          id: OSDStatisticFields.MAX_FFT,
        },
      ],
      timers: [
        {
          id: 0,
          precision: 0,
          src: OSDTimerSources.ON_ARM_TIME,
          time: 10,
        },
        {
          id: 1,
          precision: 0,
          src: OSDTimerSources.TOTAL_ARMED_TIME,
          time: 10,
        },
      ],
      unitMode: OSDUnitTypes.METRIC,
      videoSystem: OSDVideoTypes.NTSC,
      warnings: [
        {
          enabled: true,
          id: OSDWarnings.CORE_TEMPERATURE,
        },
        {
          enabled: true,
          id: OSDWarnings.FAILSAFE,
        },
      ],
      osdProfiles: {
        count: 3,
        selected: 2,
      },
    });
  });
});
