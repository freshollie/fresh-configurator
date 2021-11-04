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

  describe("deviceSetOSDProfile", () => {
    it("should write the selected osd profile", async () => {
      add("/dev/port", "abc");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOsdProfile {
            deviceSetOSDProfile(connectionId: "abc", profileIndex: 4)
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDSelectedProfile).toHaveBeenCalledWith(
        "/dev/port",
        4
      );
    });
  });

  describe("deviceSetOSDDisplayItem", () => {
    it("should write osd display item config", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDDisplayItem($displayItem: OSDDisplayItemInput!) {
            deviceSetOSDDisplayItem(
              connectionId: "abc"
              displayItem: $displayItem
            )
          }
        `,
        variables: {
          displayItem: {
            id: OSDFields.THROTTLE_POSITION,
            position: {
              x: 10,
              y: 20,
            },
            visibilityProfiles: [true, true, false],
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDDisplayItem).toHaveBeenCalledWith("/dev/port", {
        key: OSDFields.THROTTLE_POSITION,
        position: {
          x: 10,
          y: 20,
        },
        visibilityProfiles: [true, true, false],
      });
    });
  });

  describe("deviceSetOSDAlarm", () => {
    it("should write osd alarm config", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDAlarm($alarm: OSDAlarmInput!) {
            deviceSetOSDAlarm(connectionId: "abc", alarm: $alarm)
          }
        `,
        variables: {
          alarm: {
            id: OSDAlarms.CAP,
            value: 150,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDAlarm).toHaveBeenCalledWith("/dev/port", {
        key: OSDAlarms.CAP,
        value: 150,
      });
    });
  });

  describe("deviceSetOSDWarning", () => {
    it("should write osd warning config", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDWarning($warning: OSDWarningInput!) {
            deviceSetOSDWarning(connectionId: "abc", warning: $warning)
          }
        `,
        variables: {
          warning: {
            id: OSDWarnings.LAUNCH_CONTROL,
            enabled: false,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDWarning).toHaveBeenCalledWith("/dev/port", {
        key: OSDWarnings.LAUNCH_CONTROL,
        enabled: false,
      });
    });
  });

  describe("deviceSetOSDTimer", () => {
    it("should write osd timer config", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDTimer($timer: OSDTimerInput!) {
            deviceSetOSDTimer(connectionId: "abc", timer: $timer)
          }
        `,
        variables: {
          timer: {
            id: 4,
            src: OSDTimerSources.ON_ARM_TIME,
            precision: 100,
            time: 50,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDTimer).toHaveBeenCalledWith("/dev/port", {
        key: 4,
        src: OSDTimerSources.ON_ARM_TIME,
        precision: 100,
        time: 50,
      });
    });
  });

  describe("deviceSetOSDStatisticItem", () => {
    it("should write osd statistic item config", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDStatisticItem($statisticItem: OSDStatisticItemInput!) {
            deviceSetOSDStatisticItem(
              connectionId: "abc"
              statisticItem: $statisticItem
            )
          }
        `,
        variables: {
          statisticItem: {
            id: OSDStatisticFields.STAT_BATTERY,
            enabled: true,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDStatisticItem).toHaveBeenCalledWith("/dev/port", {
        key: OSDStatisticFields.STAT_BATTERY,
        enabled: true,
      });
    });
  });

  describe("deviceSetOSDVideoSystem", () => {
    it("should write the osd video system type", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDVideoSystem($videoSystem: Int!) {
            deviceSetOSDVideoSystem(
              connectionId: "abc"
              videoSystem: $videoSystem
            )
          }
        `,
        variables: {
          videoSystem: OSDVideoTypes.PAL,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDVideoSystem).toHaveBeenCalledWith(
        "/dev/port",
        OSDVideoTypes.PAL
      );
    });
  });

  describe("deviceSetOSDUnitMode", () => {
    it("should write the osd unit mode type", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDUnitMode($unitMode: Int!) {
            deviceSetOSDUnitMode(connectionId: "abc", unitMode: $unitMode)
          }
        `,
        variables: {
          unitMode: OSDUnitTypes.IMPERIAL,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDUnitMode).toHaveBeenCalledWith(
        "/dev/port",
        OSDUnitTypes.IMPERIAL
      );
    });
  });

  describe("deviceSetOSDChar", () => {
    it("should write the osd char value", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDChar($charIndex: Int!, $charBytesBuffer: [Int!]!) {
            deviceSetOSDChar(
              connectionId: "abc"
              charIndex: $charIndex
              charBytesBuffer: $charBytesBuffer
            )
          }
        `,
        variables: {
          charIndex: 67,
          charBytesBuffer: [...Buffer.from([5, 6, 7, 8])],
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeOSDChar).toHaveBeenCalledWith(
        "/dev/port",
        67,
        Buffer.from([5, 6, 7, 8])
      );
    });
  });

  describe("deviceSetOSDParameters", () => {
    it("should write the osd parameter values", async () => {
      add("/dev/port", "abc");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetOSDParameters($parameters: OSDParametersInput!) {
            deviceSetOSDParameters(connectionId: "abc", parameters: $parameters)
          }
        `,
        variables: {
          parameters: {
            cameraFrameWidth: 540,
            cameraFrameHeight: 960,
            overlayRadioMode: 4,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialOSDParameters).toHaveBeenCalledWith(
        "/dev/port",
        { cameraFrameWidth: 540, cameraFrameHeight: 960, overlayRadioMode: 4 }
      );
    });
  });
});
