import styled, { css } from "../theme";

export default styled.div`
  width: 100%;
  height: 20px;
  line-height: 20px;
  padding: 0 10px 0 10px;
  border-top: 1px solid #7d7d79;

  ${({ theme }) =>
    theme.dark
      ? css`
          background-color: #414443;
        `
      : css`
          background-color: #bfbeb5;
        `};

  display: flex;
  justify-content: space-between;
`;
