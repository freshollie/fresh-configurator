export enum MeterIndentiers {
  BATTERY = 10,
  "5V" = 20,
  "9V" = 30,
  "12V" = 40,
  ESC_COMBINED = 50,
  ESC_MOTOR_1 = 60,
  ESC_MOTOR_2 = 61,
  ESC_MOTOR_3 = 62,
  ESC_MOTOR_4 = 63,
  ESC_MOTOR_5 = 64,
  ESC_MOTOR_6 = 65,
  ESC_MOTOR_7 = 66,
  ESC_MOTOR_8 = 67,
  ESC_MOTOR_9 = 68,
  ESC_MOTOR_10 = 69,
  ESC_MOTOR_11 = 70,
  ESC_MOTOR_12 = 71,
  CELL_1 = 80,
  CELL_2 = 81,
  CELL_3 = 82,
  CELL_4 = 83,
  CELL_5 = 84,
}

export enum BatteryVoltageMeterSources {
  NONE,
  ADC,
  ESC,
}

export enum BatteryCurrentMeterSources {
  NONE,
  ADC,
  VIRTUAL,
  ESC,
  MSP,
}

export type VoltageMeters = {
  id: MeterIndentiers;
  voltage: number;
};

export type CurrentMeters = {
  id: MeterIndentiers;
  mAhDrawn: number;
  amperage: number;
};

export type LegacyVoltageMeterConfig = {
  vbat: {
    scale: number;
    minCellVoltage: number;
    maxCellVoltage: number;
    warningCellVoltage: number;
  };
  meterType: number;
};

export type VoltageMeterConfig = {
  id: MeterIndentiers;
  sensorType: number;
  vbat: {
    scale: number;
    resDivVal: number;
    resDivMultiplier: number;
  };
};

export type LegacyCurrentMeterConfig = {
  scale: number;
  offset: number;
  meterType: number;
  batteryCapacity: number;
};

export type CurrentMeterConfig = {
  id: MeterIndentiers;
  sensorType: number;
  scale: number;
  offset: number;
};

export type BatteryConfig = {
  vbat: {
    minCellVoltage: number;
    maxCellVoltage: number;
    warningCellVoltage: number;
  };
  capacity: number;
  voltageMeterSource: BatteryVoltageMeterSources;
  currentMeterSource: BatteryCurrentMeterSources;
};

export type BatteryState = {
  cellCount: number;
  capacity: number;
  voltage: number;
  mAhDrawn: number;
  amperage: number;
  batteryState: number;
};
