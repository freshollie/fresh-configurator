import React from "react";
import LandingLayout from "../src/layouts/LandingLayout";
import { LandingLogo } from "../src/logos";
import Honeycomb from "../src/components/Honeycomb";
import DonationNotice from "../src/components/DonationNotice";

export default {
  component: LandingLayout,
  title: "Layouts|Landing"
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
    <main>
      <section>
        <div>
          <h3>Some title</h3>
          <div>Some text</div>
        </div>
        <div>
          <h3>Some other title</h3>
          <div>Some other text</div>
        </div>
        <div>
          <DonationNotice />
        </div>
      </section>
    </main>
  </LandingLayout>
);
