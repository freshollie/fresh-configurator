import React from "react";
import Link from "../components/Link";

export default (
  <>
    <h3>Contributing</h3>
    <div>
      If you would like to help make Betaflight even better you can help in many
      ways, including:
      <br />
      <ul>
        <li>Answering other users questions on the forums and IRC.</li>
        <li>
          Contributing code to the firmware and configurator - new features,
          fixes, improvements
        </li>
        <li>
          Testing{" "}
          <Link href="https://github.com/Betaflight/betaflight/pulls">
            new features/fixes
          </Link>{" "}
          and providing feedback.
        </li>
        <li>
          Helping out with{" "}
          <Link href="https://github.com/betaflight/betaflight/issues">
            issues and commenting on feature requests
          </Link>
          .
        </li>
        <li>
          Collaborate by{" "}
          <Link href="https://crowdin.com/project/betaflight-configurator">
            translating the configurator application
          </Link>{" "}
          into your language.
        </li>
      </ul>
    </div>
  </>
);
