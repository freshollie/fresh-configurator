import React from "react";
import { StyledLink } from "./Link.styles";

export type LinkProps = {
  href: string;
};

const Link: React.FC<LinkProps> = ({ href, children }) => (
  <StyledLink href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </StyledLink>
);

export default Link;
