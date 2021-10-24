export enum VtxDeviceTypes {
  VTXDEV_UNSUPPORTED = 0, // reserved for MSP
  VTXDEV_RTC6705 = 1,
  // 2 reserved
  VTXDEV_SMARTAUDIO = 3,
  VTXDEV_TRAMP = 4,
  VTXDEV_UNKNOWN = 0xff,
}

export type VtxConfig = {
  type: VtxDeviceTypes;
  band: number;
  channel: number;
  power: number;
  pitMode: boolean;
  frequency: number;
  deviceReady: boolean;
  lowPowerDisarm: number;
  pitModeFrequency: number;
  table: {
    available: boolean;
    numBands: number;
    numChannels: number;
    numPowerLevels: number;
  };
};

export type VtxTablePowerLevelsRow = {
  rowNumber: number;
  value: number;
  label: string;
};

export type VtxTableBandsRow = {
  rowNumber: number;
  name: string;
  letter: string;
  isFactoryBand: boolean;
  frequencies: number[];
};

export enum SmartAudioDeviceMode {
  UNLOCKED = 16,
}

export type VtxBaseDeviceStatus = {
  deviceIsReady: boolean;
  band?: number;
  channel?: number;
  powerIndex?: number;
  frequency?: number;
  vtxStatus?: number;
  levels: number[];
  powers: number[];
};

export type VtxSmartAudioDeviceStatus = {
  type: VtxDeviceTypes.VTXDEV_SMARTAUDIO;
  version: number;
  mode: number;
  orfreq: number;
  willBootIntoPitMode: boolean;
} & VtxBaseDeviceStatus;

export type VtxTrampDeviceStatus = {
  type: VtxDeviceTypes.VTXDEV_TRAMP;
} & VtxBaseDeviceStatus;

export type VtxRtc6705DeviceStatus = {
  type: VtxDeviceTypes.VTXDEV_RTC6705;
} & VtxBaseDeviceStatus;

export type VtxUnknownDeviceStatus = {
  type: VtxDeviceTypes.VTXDEV_UNKNOWN;
} & VtxBaseDeviceStatus;

export type VtxUnsupportedDeviceStatus = {
  type: VtxDeviceTypes.VTXDEV_UNSUPPORTED;
} & VtxBaseDeviceStatus;
