import styled, { css } from "../../theme";

export const List = styled.ul`
  height: 100%;
  width: 200px;
  border-right: 4px solid ${({ theme }) => theme.colors.accent};
  background-color: #2e2e2e;
  transition: all 0.2s;
  font-size: 13px;
  margin-block-start: 0rem;
  margin-block-end: 0rem;
  padding-inline-start: 0px;

  transition: width ease-in-out 0.5s;
  @media only screen and (max-width: 1055px),
    only screen and (max-device-width: 1055px) {
    width: 42px;
  }
`;

export const NavLink = styled.li<{ active?: boolean }>`
  font-weight: normal;
  padding-left: 12px;
  padding-top: 5px;
  padding-bottom: 3px;

  background-color: ${({ active }) =>
    active
      ? css`
          ${({ theme }) => theme.colors.accent}
        `
      : css`transparent`};
  color: ${({ active }) => (active ? css`#000` : css`#999999`)};
  text-shadow: 0px 1px
    ${({ active }) =>
      active ? css` rgba(255, 255, 255, 0.45)` : css`rgba(0, 0, 0, 0.45)`};

  cursor: ${({ active }) => (active ? css`default` : css`pointer`)};

  height: 23px;
  display: flex;
  transition: none;
  border-top: solid 1px rgba(255, 255, 255, 0.05);
  /* following is just for a graceful degradation */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  &:first-child {
    border-top: 0px;
  }

  &:last-child {
    border-bottom: 0px;
  }

  svg {
    width: 16px;
    min-width: 16px;
    height: 16px;
    padding-right: 5px;
  }

  svg path {
    fill: ${({ active }) => (active ? css`#fff` : css`#818181`)};
  }

  ${({ active }) =>
    !active &&
    css`
      &:hover {
        background-color: rgba(128, 128, 128, 0.5);
        color: #fff;

        svg path {
          fill: #fff;
        }
      }
    `}

  @media only screen and (max-width: 1055px),
    only screen and (max-device-width: 1055px) {
    .text {
      padding-left: 10px;

      text-overflow: clip;
      white-space: nowrap;
    }
    overflow: hidden;
  }
`;
