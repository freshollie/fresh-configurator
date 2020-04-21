import styled from "../theme";

export default styled.div`
  > header {
    > .settings {
      > * {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-top: 5px;
        > * {
          flex: 1;
          margin-right: 10px;
        }
        > .info {
          margin-left: 5px;
          height: 28px;
          line-height: 25px;
          vertical-align: middle;
          flex: initial;
          width: 75%;
          border-bottom: solid 1px ${({ theme }) => theme.colors.subtleAccent};
        }
      }
    }
    margin-bottom: 15px;
  }

  > main {
    > .status {
      display: flex;
      flex-direction: row;

      > :first-child {
        margin-right: 12px;
        height: 400px;
        width: 100%;
      }

      > aside {
        width: 25%;

        > * {
          margin-bottom: 10px;
        }

        > :last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
`;
