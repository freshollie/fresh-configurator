import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, DonateLink } from "./DonationNotice.styles";

const TEXT_CONTENT = `
### Open Source / Donation Notice

**Betaflight** is a flight controller software that is **open source** and 
is available free of charge **without warranty** to all users.

If you found the Betaflight or Betaflight configurator useful, please 
consider **supporting** its development by donating.
`;

const TEXT_CONTENT_FOOTER = `
If you want to contribute financially on an ongoing basis, you 
should consider becoming a patron for us on [**Patreon**](https://www.patreon.com/betaflight).
`;

const DonationNotice: React.FC = () => (
  <Box>
    <ReactMarkdown>{TEXT_CONTENT}</ReactMarkdown>
    <DonateLink>Donate</DonateLink>
    <ReactMarkdown>{TEXT_CONTENT_FOOTER}</ReactMarkdown>
  </Box>
);

export default DonationNotice;
