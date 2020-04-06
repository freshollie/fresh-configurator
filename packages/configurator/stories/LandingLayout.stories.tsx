import React from "react";
import LandingLayout from "../src/layouts/LandingLayout";
import { LandingLogo } from "../src/logos";
import Honeycomb from "../src/components/Honeycomb";
import DonationNotice from "../src/components/DonationNotice";
import styled from "../src/theme";

export default {
  component: LandingLayout,
  title: "Layouts|Landing",
};

const Page = styled.div`
  height: 600px;
`;

export const example: React.FC = () => (
  <Page>
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
      <footer />
    </LandingLayout>
  </Page>
);
