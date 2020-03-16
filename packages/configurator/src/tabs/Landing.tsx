import React from "react";
import LandingLayout from "../layouts/LandingLayout";
import Honeycomb from "../components/Honeycomb";
import { LandingLogo } from "../logos";

const Landing: React.FC = () => (
  <LandingLayout>
    <header>
      <Honeycomb>
        <title>
          <div className="logo">
            <LandingLogo />
          </div>
          <span>Some title</span>
        </title>
      </Honeycomb>
    </header>
  </LandingLayout>
);

export default Landing;
