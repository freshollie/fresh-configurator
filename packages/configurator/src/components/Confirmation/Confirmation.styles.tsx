import Modal from "react-modal";
import styled from "../../theme";

// eslint-disable-next-line import/prefer-default-export
export const StyledModal = styled(Modal)`
  background-color: ${({ theme }) =>
    theme.dark ? theme.colors.secondary : "white"};
  padding: 1em;
  padding-top: 0;
  border-radius: 5px;
  border: 1px solid
    ${({ theme }) => (theme.dark ? theme.colors.accent : "silver")};

  height: auto;
  margin: auto auto;
  width: 50%;

  > main {
    min-height: 30px;
  }

  > footer {
    display: flex;
    flex-direction: row;
    > * {
      width: min-content;
      margin-right: 5px;
    }
  }
`;
