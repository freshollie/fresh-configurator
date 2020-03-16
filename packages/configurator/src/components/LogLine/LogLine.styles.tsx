import styled from "../../theme";

// eslint-disable-next-line import/prefer-default-export
export const Wrapper = styled.div`
  .message-positive {
    color: ${({ theme }) => theme.colors.accent};
  }

  .message-negative {
    color: ${({ theme }) => theme.colors.error};
    font-weight: bold;
  }
`;
