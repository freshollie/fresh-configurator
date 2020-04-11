import styled from "../../theme";

export default styled.table`
  td {
    border: 0px;
    padding-top: 2px;
    padding-bottom: 5px;
  }

  tr:not(:last-child) td {
    border-bottom: solid 1px ${({ theme }) => theme.colors.subtleAccent};
    border-style: dotted;
  }

  td:last-child {
    text-align: right;
  }
`;
