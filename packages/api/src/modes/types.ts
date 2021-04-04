export enum Modes {
  // Enables motors and flight stabilisation
  ARM = 0,
  // Legacy auto-level flight mode
  ANGLE = 1,
  // Auto-level flight mode
  HORIZON = 2,
  // Prevents dips and rolls on fast throttle changes
  ANTI_GRAVITY = 4,
  // Heading lock
  MAG = 5,
  // Head Free - When enabled yaw has no effect on pitch/roll inputs
  HEAD_FREE = 6,
  // Heading Adjust - Sets a new yaw origin for HEADFREE mode
  HEAD_ADJ = 7,
  // Camera Stabilisation
  CAM_STAB = 8,
  // Pass roll, yaw, and pitch directly from rx to servos in airplane mix
  PASSTHRU = 12,
  // Enable beeping - useful for locating a crashed aircraft
  BEEPER_ON = 13,
  // Switch off LED_STRIP output
  LED_LOW = 14,
  // Start in-flight calibration
  CALIB = 17,
  // Enable/Disable On-Screen-Display (OSD)
  OSD = 19,
  // Enable telemetry via switch
  TELEMETRY = 20,
  //	Servo 1
  SERVO1 = 23,
  // Servo 2
  SERVO2 = 24,
  // Servo 3
  SERVO3 = 25,
  // Enable BlackBox logging
  BLACKBOX = 26,
  // Enter failsafe stage 2 manually
  FAILSAFE = 27,
  // Alternative mixer and additional PID logic for more stable copter
  AIRMODE = 28,
  // Enable 3D mode
  "3D" = 29,
  // Apply yaw rotation relative to a FPV camera mounted at a preset angle
  FPV_ANGLE_MIX = 30,
  // Erase the contents of the onboard flash log chip (takes > 30 s)
  BLACKBOX_ERASE = 31,
  // Control function 1 of the onboard camera (if supported)
  CAMERA_CONTROL_1 = 32,
  // Control function 2 of the onboard camera (if supported)
  CAMERA_CONTROL_2 = 33,
  // Control function 3 of the onboard camera (if supported)
  CAMERA_CONTROL_3 = 34,
  // Reverse the motors to flip over an upside down craft after a crash (DShot required)
  FLIP_OVER_AFTER_CRASH = 35,
  // When arming, wait for this switch to be activated before actually arming
  BOX_PRE_ARM = 36,
  // Use a number of beeps to indicate the number of GPS satellites found
  BEEP_GPS_SATELLITE_COUNT = 37,
  // Switch the VTX into pit mode (low output power, if supported)
  VTX_PIT_MODE = 39,
  //	User defined switch 1. Intended to be used to control an arbitrary output with PINIO
  USER1 = 40,
  // User defined switch 2. Intended to be used to control an arbitrary output with PINIO
  USER2 = 41,
  // User defined switch 3. Intended to be used to control an arbitrary output with PINIO
  USER3 = 42,
  // User defined switch 4. Intended to be used to control an arbitrary output with PINIO
  USER4 = 43,
  // Enable output of PID controller state as audio
  PID_AUDIO = 44,
  // Permanently disable a crashed craft until it is power cycled
  PARALYZE = 45,
  // Enable 'GPS Rescue' to return the craft to the location where it was last armed
  GPS_RESCUE = 46,
  // Enable 'acro trainer' angle limiting in acro mode
  ACRO_TRAINER = 47,
  // Disable the control of VTX settings through the OSD
  DISABLE_VTX_CONTROL = 48,
  // Race start assistance system
  LAUNCH_CONTROL = 49,
}

export type ModeSlot = {
  modeId: Modes;
  auxChannel: number;
  range: {
    start: number;
    end: number;
  };
  modeLogic?: number;
  linkedTo?: number;
};
