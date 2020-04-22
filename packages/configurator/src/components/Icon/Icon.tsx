import React from "react";

import UsbDisconnectIcon from "./assets/cf_icon_usb1_white.svg";
import UsbConnectIcon from "./assets/cf_icon_usb2_white.svg";
import WelcomeIcon from "./assets/cf_icon_welcome_grey.svg";
import HelpIcon from "./assets/cf_icon_help_grey.svg";
import FlasherIcon from "./assets/cf_icon_flasher_grey.svg";
import SetupIcon from "./assets/cf_icon_setup_grey.svg";
import OSDIcon from "./assets/icon_osd.svg";
import ScrollIcon from "./assets/scroll.svg";
import ReceiverIcon from "./assets/cf_icon_rx_grey.svg";
import GyroSensorIcon from "./assets/sensor_gyro.svg";
import AccelerometerSensorIcon from "./assets/sensor_acc.svg";
import MagnetometerSensorIcon from "./assets/sensor_mag.svg";
import BarometerSensorIcon from "./assets/sensor_baro.svg";
import GpsSensorIcon from "./assets/sensor_sat.svg";
import SonarSensorIcon from "./assets/sensor_sonar.svg";

const ICONS_MAP = {
  "usb-disconnect": UsbDisconnectIcon,
  "usb-connect": UsbConnectIcon,
  welcome: WelcomeIcon,
  help: HelpIcon,
  flasher: FlasherIcon,
  setup: SetupIcon,
  osd: OSDIcon,
  scroll: ScrollIcon,
  receiver: ReceiverIcon,
  "gyro-sensor": GyroSensorIcon,
  "acc-sensor": AccelerometerSensorIcon,
  "mag-sensor": MagnetometerSensorIcon,
  "bar-sensor": BarometerSensorIcon,
  "gps-sensor": GpsSensorIcon,
  "sonar-sensor": SonarSensorIcon,
};

export type AllIcons = keyof typeof ICONS_MAP;

const Icon: React.FC<{ name: AllIcons; className?: string }> = ({
  name,
  className,
}) => {
  const Svg = ICONS_MAP[name];
  return <Svg className={className} />;
};

export default Icon;
