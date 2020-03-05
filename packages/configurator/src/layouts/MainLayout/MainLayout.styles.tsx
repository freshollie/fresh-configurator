import styled from "../../theme";

// eslint-disable-next-line import/prefer-default-export
export const Layout = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  > header {
    flex: 0;
  }
  > main {
    background-color: white;
    display: flex;
    flex-direction: row;
    flex: 1;
    > * {
      flex: 1;
    }

    > nav {
      flex: unset;
    }
  }
  > footer {
    flex: 0;
  }
`;
