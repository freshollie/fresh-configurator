import React from "react";

import { Logo1, Logo2 } from "./Logo.styles";

const LOGO_VERSIONS = {
  1: <Logo1 />,
  2: <Logo2 />
};

const Logo: React.FC<{
  version: keyof typeof LOGO_VERSIONS;
}> = ({ version }) => LOGO_VERSIONS[version];

export default Logo;
