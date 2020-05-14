import styled from "../../theme";

export default styled.table`
  width: 100%;
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

  thead {
    > td {
      white-space: nowrap;
      padding: 5px 7px;
      background-color: ${({ theme }) => theme.colors.quietHeader};
      color: ${({ theme }) => theme.colors.quietText};
    }
    > td:not(:first-child) {
      text-align: center;
    }
  }
`;
