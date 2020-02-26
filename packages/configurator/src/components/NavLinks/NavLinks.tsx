import React from "react";
import { NavLink, List } from "./NavLinks.styles";

export interface LinkDetails {
  title: string;
  icon: JSX.Element;
  id: string;
}

export interface NavLinksProps {
  links: LinkDetails[];
  activeLink?: string;
  onClick?: (id: string) => void;
}

/**
 * A component to generate a list of navlinks
 */
const NavLinks: React.FC<NavLinksProps> = ({ links, activeLink, onClick }) => (
  <List>
    {links.map(({ title, icon, id }) => (
      <NavLink
        key={id}
        active={!!(activeLink && id === activeLink)}
        onClick={() => onClick?.(id)}
      >
        {icon}
        <div>{title}</div>
      </NavLink>
    ))}
  </List>
);

export default NavLinks;
