import styled, { css } from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  width: 70px;

  color: #fff;
  font-size: 12px;
  font-weight: normal;
  text-shadow: 0px 1px rgba(0, 0, 0, 0.25);
  user-select: none;
`;

export const RoundButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  border: 1px solid #dba718;

  height: 50px;
  width: 50px;
  border-radius: 100px;

  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 0px;

  cursor: pointer;

  svg {
    width: 44px;
    height: 44px;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #e60000;
      border: 1px solid #fe0000;
    `}

  &:hover {
    background-color: #ffcc3f;

    ${({ active }) =>
      active &&
      css`
        background-color: #f21212;
      `}
  }
`;
