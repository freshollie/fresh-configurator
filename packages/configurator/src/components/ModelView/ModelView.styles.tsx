import styled, { css } from "../../theme";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Info = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: normal;
  color: ${({ theme }) => (theme.dark ? css`white` : theme.colors.mutedText)};

  display: flex;
  > :first-child {
    margin-right: 10px;
  }
`;

export const ResetButton = styled.a`
  position: absolute;
  display: block;
  top: 10px;
  right: 10px;
  border-radius: 3px;
  bottom: 10px;
  height: 28px;
  line-height: 28px;
  padding: 0 15px 0 15px;
  text-align: center;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.colors.subtleAccent};
  background-color: #ececec;
  user-select: none;
  z-index: 2;
  cursor: pointer;

  &:hover {
    background-color: #dedcdc;
  }
`;
