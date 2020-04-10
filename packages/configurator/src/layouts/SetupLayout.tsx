import styled from "../theme";

export default styled.div`
  > header {
    margin-bottom: 5px;
  }

  > main {
    > .settings {
    }
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
