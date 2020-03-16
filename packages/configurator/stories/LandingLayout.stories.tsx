import React from "react";
import LandingLayout from "../src/layouts/LandingLayout";
import { LandingLogo } from "../src/logos";
import Honeycomb from "../src/components/Honeycomb";

export default {
  component: LandingLayout,
  title: "Components|Landing Layout"
};

export const example: React.FC = () => (
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
