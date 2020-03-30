import React from "react";
import LandingLayout from "../layouts/LandingLayout";
import Honeycomb from "../components/Honeycomb";
import { LandingLogo } from "../logos";
import LandingHardwareText from "../text/LandingHardwareText";
import LandingContributionText from "../text/LandingContributionText";
import DonationNotice from "../components/DonationNotice";

const Landing: React.FC = () => (
  <LandingLayout>
    <header>
      <Honeycomb>
        <title>
          <div className="logo">
            <LandingLogo />
          </div>
          <span>
            Welcome to <strong>Betaflight - Configurator</strong>, a utility
            designed to simplify updating, configuring and tuning of your flight
            controller.
          </span>
        </title>
      </Honeycomb>
    </header>
    <main>
      <section>
        <div>{LandingHardwareText}</div>
        <div>{LandingContributionText}</div>
        <div>
          <DonationNotice />
        </div>
      </section>
    </main>
    <footer />
  </LandingLayout>
);

export default Landing;
