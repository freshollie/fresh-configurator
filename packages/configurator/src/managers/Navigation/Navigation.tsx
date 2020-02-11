import React from "react";

import {
  useNavigationDataQuery,
  useSelectTabMutation
} from "../../gql/__generated__";
import useConnected from "../../hooks/useConnected";

import WelcomeIcon from "../../icons/cf_icon_welcome_grey.svg";
import HelpIcon from "../../icons/cf_icon_help_grey.svg";
import FlasherIcon from "../../icons/cf_icon_flasher_grey.svg";
import SetupIcon from "../../icons/cf_icon_setup_grey.svg";
import OSDIcon from "../../icons/icon_osd.svg";
import { TabsContainer, TabLink } from "./Navigation.styles";

interface LinkDetails {
  title: string;
  icon: JSX.Element;
  id: string;
  export?: boolean;
}

const disconnectedLinks: LinkDetails[] = [
  {
    title: "Welcome",
    icon: <WelcomeIcon />,
    id: "landing"
  },
  {
    title: "Change log",
    icon: <HelpIcon />,
    id: "change-log"
  },
  { title: "Privacy Policy", icon: <HelpIcon />, id: "privary-policy" },
  {
    title: "Documentation & Support",
    icon: <HelpIcon />,
    id: "documentation"
  },
  {
    title: "Firmware Flasher",
    icon: <FlasherIcon />,
    id: "flasher"
  }
];

const connectedLinks: LinkDetails[] = [
  {
    title: "Setup",
    icon: <SetupIcon />,
    id: "setup"
  },
  {
    title: "OSD",
    icon: <OSDIcon />,
    id: "osd"
  }
];

/*
          <>
            { 

              <li className="tab_ports">
                <a
                  href="#"
                  i18n="tabPorts"
                  className="tabicon ic_ports"
                  i18n_title="tabPorts"
                />
              </li>
              <li className="tab_configuration">
                <a
                  href="#"
                  i18n="tabConfiguration"
                  className="tabicon ic_config"
                  i18n_title="tabConfiguration"
                />
              </li>
              <li className="tab_power">
                <a
                  href="#"
                  i18n="tabPower"
                  className="tabicon ic_power"
                  i18n_title="tabPower"
                />
              </li>
              <li className="tab_failsafe">
                <a
                  href="#"
                  i18n="tabFailsafe"
                  className="tabicon ic_failsafe"
                  i18n_title="tabFailsafe"
                />
              </li>
              <li className="tab_pid_tuning">
                <a
                  href="#"
                  i18n="tabPidTuning"
                  className="tabicon ic_pid"
                  i18n_title="tabPidTuning"
                />
              </li>
              <li className="tab_receiver">
                <a
                  href="#"
                  i18n="tabReceiver"
                  className="tabicon ic_rx"
                  i18n_title="tabReceiver"
                />
              </li>
              <li className="tab_auxiliary">
                <a
                  href="#"
                  i18n="tabAuxiliary"
                  className="tabicon ic_modes"
                  i18n_title="tabAuxiliary"
                />
              </li>
              <li className="tab_adjustments">
                <a
                  href="#"
                  i18n="tabAdjustments"
                  className="tabicon ic_adjust"
                  i18n_title="tabAdjustments"
                />
              </li>
              <li className="tab_servos">
                <a
                  href="#"
                  i18n="tabServos"
                  className="tabicon ic_servo"
                  i18n_title="tabServos"
                />
              </li>
              <li className="tab_gps">
                <a
                  href="#"
                  i18n="tabGPS"
                  className="tabicon ic_gps"
                  i18n_title="tabGPS"
                />
              </li>
              <li className="tab_motors">
                <a
                  href="#"
                  i18n="tabMotorTesting"
                  className="tabicon ic_motor"
                  i18n_title="tabMotorTesting"
                />
              </li>
              <li className="tab_osd">
                <a
                  href="#"
                  i18n="tabOsd"
                  className="tabicon ic_osd"
                  i18n_title="tabOsd"
                />
              </li>
              <li className="tab_vtx">
                <a
                  href="#"
                  i18n="tabVtx"
                  className="tabicon ic_vtx"
                  i18n_title="tabVtx"
                />
              </li>
              <li className="tab_transponder">
                <a
                  href="#"
                  i18n="tabTransponder"
                  className="tabicon ic_transponder"
                  i18n_title="tabTransponder"
                />
              </li>
              <li className="tab_led_strip">
                <a
                  href="#"
                  i18n="tabLedStrip"
                  className="tabicon ic_led"
                  i18n_title="tabLedStrip"
                />
              </li>
              <li className="tab_sensors">
                <a
                  href="#"
                  i18n="tabRawSensorData"
                  className="tabicon ic_sensors"
                  i18n_title="tabRawSensorData"
                />
              </li>
              <li className="tab_logging">
                <a
                  href="#"
                  i18n="tabLogging"
                  className="tabicon ic_log"
                  i18n_title="tabLogging"
                />
              </li>
              <li className="tab_onboard_logging">
                <a
                  href="#"
                  i18n="tabOnboardLogging"
                  className="tabicon ic_data"
                  i18n_title="tabOnboardLogging"
                />
              </li>

              <li className="">
                <a href="#" className="tabicon ic_mission">
                  Mission (spare icon)
                </a>
              </li>
              <li className="">
                <a href="#" className="tabicon ic_advanced">
                  Advanced (spare icon)
                </a>
              </li>
              <li className="">
                <a href="#" className="tabicon ic_wizzard">
                  Wizzard (spare icon)
                </a>
              </li> }
          </>
          */

// {/* <ul className="mode-connected mode-connected-cli">
//     <li className="tab_cli">
//       <a
//         href="#"
//         i18n="tabCLI"
//         className="tabicon ic_cli"
//         i18n_title="tabCLI"
//       />
//     </li>
//   </ul> */

const Navigation: React.FC = () => {
  const { data: navigationQuery } = useNavigationDataQuery();
  const connected = useConnected();
  const [selectTab] = useSelectTabMutation();

  const makeLink = ({ title, icon, id }: LinkDetails): JSX.Element => (
    <TabLink
      key={id}
      active={id === navigationQuery?.configurator.tab}
      onClick={() =>
        selectTab({
          variables: {
            tabId: id
          }
        })
      }
    >
      {icon}
      <div>{title}</div>
    </TabLink>
  );

  return (
    <TabsContainer>
      <ul>
        {!connected
          ? disconnectedLinks.map(makeLink)
          : connectedLinks.map(makeLink)}
      </ul>
    </TabsContainer>
  );
};

export default Navigation;
