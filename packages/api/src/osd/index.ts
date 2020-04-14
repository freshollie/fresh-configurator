import semver from "semver";
import { times, reduce } from "rambda";
import { WriteBuffer, apiVersion, execute } from "@betaflight/msp";
import { bitCheck } from "../utils";
import {
  osdFields,
  OSD_VIDEO_VALUE_TO_TYPE,
  OSD_UNIT_VALUE_TO_TYPE,
  osdTimerSources,
  osdStaticFields,
  OSD_PRECISION_VALUE_TO_TYPE,
  osdWarnings,
  OSD_VALUE_VISIBLE,
  osdAlarms,
} from "./constants";

import codes from "../codes";
import {
  OSDOtherData,
  OSDAlarm,
  OSDFlags,
  OSDWarning,
  OSDConfig,
  OSD_VIDEO_TYPES,
  OSD_ALARMS,
  OSD_TIMER_SOURCES,
  OSD_WARNINGS,
  OSD_FIELDS,
  OSD_UNIT_TYPES,
  OSD_STATIC_FIELDS,
  OSDParameters,
  OSDStaticItem,
  OSDDisplayItem,
  OSDTimer,
} from "./types";

export * as OSDTypes from "./types";

const isVisible = (positionData: number, profile: number): boolean =>
  positionData !== -1 && (positionData & (OSD_VALUE_VISIBLE << profile)) !== 0;

const unpackPosition = (positionData: number): [number, number] => [
  positionData & 0x001f,
  (positionData >> 5) & 0x001f,
];

const unpackLegacyPosition = (positionData: number): [number, number] =>
  positionData === -1 ? [0, 0] : [positionData, 0];

const packLegacyPosition = (
  position: [number, number],
  visible: boolean
): number => {
  if (visible) {
    return position[0] === -1 ? 0 : position[0];
  }
  return -1;
};

const inWriteOrder = <K, T extends { key: K }>(
  values: T[],
  sortOrder: K[],
  subsitutions: T[]
): T[] =>
  sortOrder.map(
    (orderedKey, i) =>
      values.find(({ key }) => key === orderedKey) ?? subsitutions[i]
  );

export const readOSDConfig = async (port: string): Promise<OSDConfig> => {
  const api = apiVersion(port);
  const data = await execute(port, { code: codes.MSP_OSD_CONFIG });

  const expectedDisplayItems = osdFields(api);

  const flagsData = data.readU8();
  const hasOSD = flagsData !== 0;
  const flag0Active = bitCheck(flagsData, 0);

  const videoSystem = hasOSD
    ? OSD_VIDEO_VALUE_TO_TYPE[data.readU8()]
    : OSD_VIDEO_TYPES.AUTO;
  const unitMode =
    hasOSD && semver.gte(api, "1.21.0") && flag0Active
      ? OSD_UNIT_VALUE_TO_TYPE[data.readU8()]
      : OSD_UNIT_TYPES.IMPERIAL;

  const alarms =
    hasOSD && semver.gte(api, "1.21.0") && flag0Active
      ? [
        { key: OSD_ALARMS.RSSI, value: data.readU8() },
        { key: OSD_ALARMS.CAP, value: data.readU16() },
      ]
      : [];

  let displayItemsCount = expectedDisplayItems.length;

  if (hasOSD && semver.gte(api, "1.36.0") && flag0Active) {
    // This value was obsoleted by the introduction of configurable timers, and has been reused to encode the number of display elements sent in this command
    data.readU8();
    const tmp = data.readU8();
    if (semver.gte(api, "1.37.0")) {
      displayItemsCount = tmp;
    }
  } else {
    alarms.push({ key: OSD_ALARMS.TIME, value: data.readU16() });
  }

  if (hasOSD && semver.gte(api, "1.36.0") && flag0Active) {
    alarms.push({ key: OSD_ALARMS.ALT, value: data.readU16() });
  }

  const haveMax7456Video =
    bitCheck(flagsData, 4) || (flagsData === 1 && semver.lt(api, "1.34.0"));

  const flags = {
    hasOSD,
    haveMax7456Video,
    isMax7456Detected:
      bitCheck(flagsData, 5) || (haveMax7456Video && semver.lt(api, "1.43.0")),
    haveOsdFeature:
      bitCheck(flagsData, 0) || (flagsData === 1 && semver.lt(api, "1.34.0")),
    isOsdSlave: bitCheck(flagsData, 1) && semver.gte(api, "1.34.0"),
  };

  // Read display element positions, the parsing is done later because we need the number of profiles
  const itemPositions = semver.gte(api, "1.21.0")
    ? times(() => data.readU16(), displayItemsCount)
    : times(() => data.read16(), displayItemsCount);

  const expectedStaticFields = osdStaticFields(api);
  const staticItems = semver.gte(api, "1.36.0")
    ? times(
      (i) => ({
        key: expectedStaticFields[i] ?? OSD_STATIC_FIELDS.UNKNOWN,
        enabled: data.readU8() === 1,
      }),
      data.readU8()
    )
    : [];

  // Parse configurable timers
  const timersCount = data.readU8();
  const timerSources = osdTimerSources(api);
  const timers = semver.gte(api, "1.36.0")
    ? times((i) => {
      const timerData = data.readU16();
      return {
        key: i,
        src: timerSources[timerData & 0x0f] ?? OSD_TIMER_SOURCES.UNKNOWN,
        precision: OSD_PRECISION_VALUE_TO_TYPE[(timerData >> 4) & 0x0f],
        time: (timerData >> 8) & 0xff,
      };
    }, timersCount)
    : [];

  // Parse warning
  const expectedWarnings = osdWarnings(api);
  let warningCount = expectedWarnings.length;
  let warningFlags = data.readU16();
  if (semver.gte(api, "1.41.0")) {
    warningCount = data.readU8();
    // the flags were replaced with a 32bit version
    warningFlags = data.readU32();
  }
  const warnings = semver.gte(api, "1.36.0")
    ? times(
      (i) => ({
        key: expectedWarnings[i] ?? OSD_WARNINGS.UNKNOWN,
        enabled: (warningFlags & (1 << i)) !== 0,
      }),
      warningCount
    )
    : [];

  const osdProfiles = semver.gte(api, "1.41.0")
    ? {
      count: data.readU8(),
      selected: data.readU8() - 1,
    }
    : {
      count: 1,
      selected: 0,
    };

  const parameters = {
    overlayRadioMode: semver.gte(api, "1.41.0") ? data.readU8() : 0,
    cameraFrameWidth: semver.gte(api, "1.43.0") ? data.readU8() : 24,
    cameraFrameHeight: semver.gte(api, "1.43.0") ? data.readU8() : 11,
  };

  const displayItems = itemPositions.map((positionData, i) => ({
    key: expectedDisplayItems[i] ?? OSD_FIELDS.UNKNOWN,
    position: semver.gte(api, "1.21.0")
      ? unpackPosition(positionData)
      : unpackLegacyPosition(positionData),
    visibility: times(
      (profileIndex) => isVisible(positionData, profileIndex),
      osdProfiles.count
    ),
  }));

  return {
    flags,
    staticItems,
    displayItems,
    alarms,
    timerSources,
    warnings,
    timers,
    videoSystem,
    osdProfiles,
    parameters,
    unitMode,
  };
};

export const writeOSDDisplayItem = async (
  port: string,
  { key, visibility, position }: OSDDisplayItem
): Promise<void> => {
  const data = new WriteBuffer();
  const api = apiVersion(port);
  const itemOrder = osdFields(api);

  const index = itemOrder.indexOf(key);

  if (index === -1) {
    throw new Error(`OSD_FIELD.${OSD_FIELDS[key]} does not exist on device`);
  }

  const packedPosition = semver.gte(api, "1.21.0")
    ? reduce(
      (packedVisible, visibilityProfile, i) =>
        packedVisible | (visibilityProfile ? OSD_VALUE_VISIBLE << i : 0),
      0,
      visibility
    ) |
    ((position[1] & 0x001f) << 5) |
    position[0]
    : packLegacyPosition(position, visibility[0]);

  data.push8(index);
  data.push16(packedPosition);

  await execute(port, {
    code: codes.MSP_SET_OSD_CONFIG,
    data,
  });
};

const writeOSDOtherData = async (
  port: string,
  {
    flags,
    videoSystem,
    unitMode,
    alarms,
    warnings,
    osdProfiles,
    parameters,
  }: OSDOtherData
): Promise<void> => {
  const api = apiVersion(port);
  const data = new WriteBuffer();
  data.push(-1, videoSystem);

  if (flags.hasOSD && semver.gte(api, "1.21.0")) {
    data.push8(unitMode);

    // watch out, order matters! match the firmware
    data.push8(alarms[0].value);
    data.push16(alarms[1].value);
    if (semver.lt(api, "1.36.0")) {
      data.push16(alarms[2].value);
    } else {
      // This value is unused by the firmware with configurable timers
      data.push16(0);
    }

    data.push16(alarms[3].value);
    if (semver.gte(api, "1.37.0")) {
      const warningFlags = reduce(
        (acc, warning, i) => (warning.enabled ? acc | (1 << i) : acc),
        0,
        warnings
      );

      data.push16(warningFlags);

      if (semver.gte(api, "1.41.0")) {
        data.push32(warningFlags);

        data.push8(osdProfiles.selected + 1);

        data.push8(parameters.overlayRadioMode);
      }

      if (semver.gte(api, "1.43.0")) {
        data.push8(parameters.cameraFrameWidth);
        data.push8(parameters.cameraFrameHeight);
      }
    }
  }

  await execute(port, { code: codes.MSP_SET_OSD_CONFIG, data });
};

export const writeOSDAlarm = async (
  port: string,
  alarm: OSDAlarm
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, {
    ...osdConfig,
    alarms: inWriteOrder([alarm], osdAlarms(), osdConfig.alarms),
  });
};

export const writeOSDFlags = async (
  port: string,
  flags: OSDFlags
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, { ...osdConfig, flags });
};

export const writeOSDWarning = async (
  port: string,
  warning: OSDWarning
): Promise<void> => {
  const api = apiVersion(port);
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, {
    ...osdConfig,
    warnings: inWriteOrder([warning], osdWarnings(api), osdConfig.warnings),
  });
};

export const writeOSDSelectedProfile = async (
  port: string,
  selectedIndex: number
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, {
    ...osdConfig,
    osdProfiles: { ...osdConfig.osdProfiles, selected: selectedIndex },
  });
};

export const writeOSDVideoSystem = async (
  port: string,
  videoSystem: OSD_VIDEO_TYPES
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, { ...osdConfig, videoSystem });
};

export const writeOSDUnitMode = async (
  port: string,
  unitMode: OSD_UNIT_TYPES
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, { ...osdConfig, unitMode });
};

export const writeOSDParameters = async (
  port: string,
  parameters: OSDParameters
): Promise<void> => {
  const osdConfig = await readOSDConfig(port);

  await writeOSDOtherData(port, { ...osdConfig, parameters });
};

export const writeOSDStaticItem = async (
  port: string,
  { key, enabled }: OSDStaticItem
): Promise<void> => {
  const data = new WriteBuffer();
  const staticItemsOrder = osdStaticFields(apiVersion(port));

  const index = staticItemsOrder.indexOf(key);

  if (index === -1) {
    throw new Error(
      `OSD_STATIC_FIELDS.${OSD_STATIC_FIELDS[key]} does not exist on device`
    );
  }
  data.push8(index);
  data.push16(Number(enabled));
  data.push8(0);
  await execute(port, { code: codes.MSP_SET_OSD_CONFIG, data });
};

export const writeOSDTimer = async (
  port: string,
  timer: OSDTimer
): Promise<void> => {
  const data = new WriteBuffer();
  data.push(-2, timer.key);
  data.push16(
    (timer.src & 0x0f) |
    ((timer.precision & 0x0f) << 4) |
    ((timer.time & 0xff) << 8)
  );
  await execute(port, { code: codes.MSP_SET_OSD_CONFIG, data });
};
