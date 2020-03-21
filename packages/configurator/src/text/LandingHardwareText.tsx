import React from "react";
import Link from "../components/Link";

export default (
  <>
    <h3>Hardware</h3>
    <div>
      The application supports all hardware that can run Betaflight. Check flash
      tab for full list of hardware.
      <br />
      <br />
      <Link href="https://github.com/betaflight/blackbox-log-viewer/releases">
        Download Betaflight Blackbox Log Viewer
      </Link>
      <br />
      <br />
      The firmware source code can be downloaded from{" "}
      <Link href="https://github.com/betaflight/betaflight">here</Link>
      <br />
      <br />
      The latest <b>STM USB VCP Drivers</b> can be downloaded from{" "}
      <Link href="http://www.st.com/web/en/catalog/tools/PF257938">here</Link>
      <br />
      For legacy hardware using a CP210x USB to serial chip:
      <br />
      The latest <b>CP210x Drivers</b> can be downloaded from{" "}
      <Link href="https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers">
        here
      </Link>
      <br />
      The latest <b>Zadig</b> for Windows USB driver installation can be
      downloaded from <Link href="http://zadig.akeo.ie/">here</Link>
      <br />
    </div>
  </>
);
