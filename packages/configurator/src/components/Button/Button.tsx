import styled, { css } from "../../theme";

export default styled.button`
  width: 100%;
  padding: 5px 0px 5px 0px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 4px;
  border: 1px solid #dba718;
  color: #000;
  font-weight: 600;
  font-size: 12px;
  line-height: 13px;
  display: block;
  transition: all ease 0.2s;

  &:hover:enabled {
    cursor: pointer;
    background-color: #ffcc3f;
    color: #000;
    text-shadow: 0px 1px rgba(255, 255, 255, 0.25);
    transition: all ease 0.2s;
  }

  &:disabled {
    background-color: #f1f1f1;
    border-color: ${({ theme }) => theme.colors.subtleAccent};
    color: #ccc;

    ${({ theme }) =>
      theme.dark &&
      css`
        background-color: #393b3a;
        border: 1px solid #ffbb2a;
      `}
  }

  &:active {
    background-color: #ffcc3f;
    transition: all ease 0s;
    box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.35);
  }
`;
