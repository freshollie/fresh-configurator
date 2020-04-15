import styled, { css } from "../../theme";

type StatusProps = {
  positive: boolean;
};

export default styled.span<StatusProps>`
  background-color: ${({ positive }) =>
    positive ? css`#56ac1d` : css`#e60000`};
  color: #fff;
  font-size: 10px;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
`;
