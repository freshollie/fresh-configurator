import styled, { css } from "../../theme";

export default styled.ul`
  display: flex;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;

  > li {
    display: block;
    ${({ theme }) =>
      theme.dark
        ? css`
            border-right: 1px solid #9c9c9c;
          `
        : css`
            border-right: 1px solid #7d7d79;
          `}
    padding-right: 10px;
    margin-right: 10px;
  }
`;
